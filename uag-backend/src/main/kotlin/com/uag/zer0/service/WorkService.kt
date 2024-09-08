package com.uag.zer0.service

import com.uag.zer0.dto.WorkWithDetails
import com.uag.zer0.entity.work.*
import com.uag.zer0.repository.counters.CountersRepository
import com.uag.zer0.repository.work.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.time.Instant
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Service
class WorkService(
    private val workRepository: WorkRepository,
    private val tagRepository: TagRepository,
    private val characterRepository: CharacterRepository,
    private val creatorRepository: CreatorRepository,
    private val imgRepository: ImgRepository,
    private val countersRepository: CountersRepository,
    private val convertService: ConvertService,
    private val uploadService: UploadService
) {

    private val logger = LoggerFactory.getLogger(WorkService::class.java)

    @Transactional
    fun findWorkByWorkId(workId: Int): WorkWithDetails {
        val work = workRepository.findByWorkId(workId)
        logger.info(work.toString())
        val tags = tagRepository.findByWorkId(workId)
        val imgs = imgRepository.findByWorkId(workId)
        val characters = characterRepository.findByWorkId(workId)
        val creators = creatorRepository.findByWorkId(workId)
        return WorkWithDetails(
            work = work,
            characters = characters,
            creators = creators,
            tags = tags,
            imgs = imgs
        )
    }

    @Transactional
    fun findWorksByTags(words: List<String>?): List<Work> {
        // 空のリストやnullチェック
        if (words.isNullOrEmpty()) {
            logger.info("入力されたタグが空、もしくはnullです。")
            return emptyList()
        }
        logger.info("入力されたタグ: $words")

        // 各単語でタグ検索
        val workIds = mutableListOf<Int>()
        words.forEach { word ->
            logger.info("検索タグ: $word")

            val results = tagRepository.findByTag(word)
            logger.info("タグ検索結果: ${results.map { it.workId }}")

            results.forEach { tag ->
                workIds.add(tag.workId)
            }
        }

        val uniqueWorkIds = workIds.distinct()
        logger.info("タグ検索でのユニークな作品ID一覧: $uniqueWorkIds")

        // 作品IDで作品情報を取得
        val works = mutableListOf<Work>()
        uniqueWorkIds.forEach { workId ->
            val work = workRepository.findByWorkId(workId)
            logger.info("タグ検索での取得した作品: $work")
            works.add(work)
        }

        logger.info("最終的にタグ検索で取得した作品リスト: $works")
        return works
    }

    @Transactional
    fun findWorksByFreeWords(words: List<String>?): List<Work> {
        // 空のリストやnullチェック
        if (words.isNullOrEmpty()) {
            logger.info("入力されたワードが空、もしくはnullです。")
            return emptyList()
        }
        logger.info("入力されたワード: $words")

        // 各単語でフリーワード検索
        val workIds = mutableListOf<Int>()
        words.forEach { word ->
            logger.info("検索ワード: $word")

            // 完全一致でタグ検索
            val tagResults = tagRepository.findByTag(word)
            logger.info("フリーワード検索でのタグ検索結果: ${tagResults.map { it.workId }}")
            tagResults.forEach { tag ->
                workIds.add(tag.workId)
            }

            // 完全一致でジャンル検索
            val genreResults = workRepository.findByGenre(word)
            logger.info("ジャンル検索結果: ${genreResults.map { it.workId }}")
            genreResults.forEach { work ->
                workIds.add(work.workId)
            }

            // 完全一致でフォーマット検索
            val formatResults = workRepository.findByFormat(word)
            logger.info("フォーマット検索結果: ${formatResults.map { it.workId }}")
            formatResults.forEach { work ->
                workIds.add(work.workId)
            }

            // 完全一致でキャラクター検索
            val characterResults = characterRepository.findByCharacter(word)
            logger.info("キャラクター検索結果: ${characterResults.map { it.workId }}")
            characterResults.forEach { character ->
                workIds.add(character.workId)
            }

            // 完全一致でクリエーター検索
            val creatorResults = creatorRepository.findByCreator(word)
            logger.info("クリエーター検索結果: ${creatorResults.map { it.workId }}")
            creatorResults.forEach { creator ->
                workIds.add(creator.workId)
            }

            // ToDo: メインタイトル、サブタイトル、説明の部分一致検索
        }

        val uniqueWorkIds = workIds.distinct()
        logger.info("ユニークな作品ID一覧: $uniqueWorkIds")

        // 作品IDで作品情報を取得
        val works = mutableListOf<Work>()
        uniqueWorkIds.forEach { workId ->
            val work = workRepository.findByWorkId(workId)
            logger.info("取得した作品: $work")
            works.add(work)
        }

        logger.info("最終的に取得した作品リスト: $works")
        return works
    }

    @Transactional
    fun registerWork(
        work: Work,
        characters: List<Character>?,
        creators: List<Creator>?,
        tags: List<Tag>?,
        titleImage: MultipartFile,
        images: List<MultipartFile>
    ): WorkWithDetails {
        // countersからcounterValueを取得
        val nextWorkId = countersRepository.findByCounterName("workId") + 1
        val nowDate = Instant.now()

        // workをregister
        work.workId = nextWorkId
        val formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")
        val titleImageAvif =
            convertService.convertToAvifWithStream(titleImage)
        val titleTimestamp = LocalDateTime.now().format(formatter)
        val titleImageUrl = uploadService.uploadToS3(
            titleImageAvif,
            "titleImage_$titleTimestamp.avif"
        )
        // ToDo: ImgURLはCloudFrontのURLに変換してDBに格納する
        work.titleImgUrl = titleImageUrl
        work.updatedAt = nowDate
        work.createdAt = nowDate
        workRepository.registerWork(work)

        // characterをregister
        if (characters != null) {
            characters.forEach { character ->
                character.workId = nextWorkId
                character.updatedAt = nowDate
            }
            characterRepository.registerCharacters(characters)
        }

        // creatorをregister
        if (creators != null) {
            creators.forEach { creator ->
                creator.workId = nextWorkId
                creator.updatedAt = nowDate
            }
            creatorRepository.registerCreators(creators)
        }

        // tagをregister
        if (tags != null) {
            tags.forEach { tag ->
                tag.workId = nextWorkId
                tag.updatedAt = nowDate
            }
            tagRepository.registerTags(tags)
        }

        // imgをregister
        val imageUrls = images.map { image ->
            val avifImage =
                convertService.convertToAvifWithStream(image)
            val imageTimestamp = LocalDateTime.now().format(formatter)
            val imageName = "workImage_$imageTimestamp.avif"
            uploadService.uploadToS3(avifImage, imageName)
        }
        // ToDo: ImgURLはCloudFrontのURLに変換してDBに格納する
        val imgObjects = mutableListOf<Img>()
        var pageNum = 1
        imageUrls.forEach { imageUrl ->
            imgObjects.add(
                Img(
                    workId = nextWorkId,
                    imgUrl = imageUrl,
                    imgPageNum = pageNum++
                )
            )
        }
        imgRepository.registerImgs(imgObjects)
        // countersをインクリメント
        countersRepository.incrementCounterValue("workId")

        // WorkWithDetailsの生成と返却
        return WorkWithDetails(
            work = work,
            characters = characters,
            creators = creators,
            tags = tags,
            imgs = imgObjects
        )
    }
}