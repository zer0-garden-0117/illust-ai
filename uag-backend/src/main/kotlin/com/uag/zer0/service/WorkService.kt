package com.uag.zer0.service

import com.uag.zer0.entity.work.*
import com.uag.zer0.repository.counters.CountersRepository
import com.uag.zer0.repository.work.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
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

    fun findWorkByWorkId(workId: Int): Work {
        val work = workRepository.findByWorkId(workId)
        logger.info(work.toString())
        return work
    }

    fun findWorksByTags(words: List<String>?): List<Work> {
        // 空のリストやnullチェック
        if (words.isNullOrEmpty()) {
            return emptyList()
        }

        // 各単語でタグ検索
        val workIds = mutableListOf<Int>()
        words.forEach { word ->
            val results = tagRepository.findWorkIdsByTag(word)
            results.forEach { workId ->
                workIds.add(workId)
            }
        }
        val uniqueWorkIds = workIds.distinct()

        // 作品IDで作品情報を取得
        val works = mutableListOf<Work>()
        uniqueWorkIds.forEach { workId ->
            val work = workRepository.findByWorkId(workId)
            works.add(work)
            logger.info(work.toString())
        }
        return works
    }

    fun findWorksByFreeWords(words: List<String>?): List<Work> {
        // 空のリストやnullチェック
        if (words.isNullOrEmpty()) {
            return emptyList()
        }

        // 各単語でフリーワード検索
        val workIds = mutableListOf<Int>()
        words.forEach { word ->
            // 完全一致でタグ検索
            val tagResults = tagRepository.findWorkIdsByTag(word)
            tagResults.forEach { workId ->
                workIds.add(workId)
            }
            // 完全一致でジャンル検索
            val genreResults = workRepository.findByGenre(word)
            genreResults.forEach { work ->
                workIds.add(work.workId)
            }
            // 完全一致でフォーマット検索
            val formatResults = workRepository.findByFormat(word)
            formatResults.forEach { work ->
                workIds.add(work.workId)
            }
            // 完全一致でキャラクター検索
            val characterResults =
                characterRepository.findWorkIdsByCharacter(word)
            characterResults.forEach { workId ->
                workIds.add(workId)
            }
            // 完全一致でクリエーター検索
            val creatorResults = creatorRepository.findWorkIdsByCreator(word)
            creatorResults.forEach { workId ->
                workIds.add(workId)
            }
            // ToDo: メインタイトル、サブタイトル、説明の部分一致検索
            // 部分一致検索のためにワード解析、マッピングが必要
        }
        val uniqueWorkIds = workIds.distinct()

        // 作品IDで作品情報を取得
        val works = mutableListOf<Work>()
        uniqueWorkIds.forEach { workId ->
            val work = workRepository.findByWorkId(workId)
            works.add(work)
            logger.info(work.toString())
        }
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
    ) {
        // countersからcounterValueを取得
        val nextWorkId = countersRepository.findByCounterName("workId") + 1

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
        workRepository.registerWork(work)

        // characterをregister
        if (characters != null) {
            characters.forEach { character ->
                character.workId = nextWorkId
            }
            characterRepository.registerCharacters(characters)
        }

        // creatorをregister
        if (creators != null) {
            creators.forEach { creator ->
                creator.workId = nextWorkId
            }
            creatorRepository.registerCreators(creators)
        }

        // tagをregister
        if (tags != null) {
            tags.forEach { tag ->
                tag.workId = nextWorkId
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
    }
}