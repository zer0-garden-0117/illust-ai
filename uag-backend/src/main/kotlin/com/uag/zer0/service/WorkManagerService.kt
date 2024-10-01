package com.uag.zer0.service

import com.uag.zer0.dto.WorkWithDetails
import com.uag.zer0.dto.WorksWithSearchResult
import com.uag.zer0.entity.work.*
import com.uag.zer0.repository.counters.CountersRepository
import com.uag.zer0.repository.work.*
import com.uag.zer0.service.work.CharacterService
import com.uag.zer0.service.work.CreatorService
import com.uag.zer0.service.work.TagService
import com.uag.zer0.service.work.WorkService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.time.Instant
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Service
class WorkManagerService(
    private val workRepository: WorkRepository,
    private val workService: WorkService,
    private val tagRepository: TagRepository,
    private val tagService: TagService,
    private val characterRepository: CharacterRepository,
    private val characterService: CharacterService,
    private val creatorRepository: CreatorRepository,
    private val creatorService: CreatorService,
    private val imgRepository: ImgRepository,
    private val countersRepository: CountersRepository,
    private val convertService: ConvertService,
    private val uploadService: UploadService
) {

    private val logger = LoggerFactory.getLogger(WorkService::class.java)

    private data class WorkInfo(
        val workId: Int,
        val updatedAt: Instant
    )

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
    fun findLatestWorks(numberOfWorks: Int): WorksWithSearchResult {
        val latestWorkId = countersRepository.findByCounterName("workId")
        // Create a list of integers from latestWorkId down to the specified number of entries prior
        val workIds = (maxOf(
            latestWorkId - (numberOfWorks - 1),
            1
        )..latestWorkId).toList().reversed()
        val works = workService.findWorksByIds(workIds).filterNotNull()

        // works のリストから最新の4個を取得
        val latestWorks = works.take(4)
        logger.info(latestWorks.toString())

        return WorksWithSearchResult(
            works = latestWorks,
            totalCount = latestWorks.size
        )
    }

    @Transactional
    fun findWorksByTags(
        words: List<String>?,
        offset: Int,
        limit: Int
    ): WorksWithSearchResult? {
        // 空のリストやnullチェック
        if (words.isNullOrEmpty()) {
            logger.info("入力されたタグが空、もしくはnullです。")
            return null
        }
        logger.info("入力されたタグ: $words")

        // 各単語でタグ検索
        val workIds = mutableListOf<Int>()
        val tagResult = tagService.findByTagsWithOffset(words, offset, limit)
        logger.info("タグ検索結果: ${tagResult.tags.map { it.workId }}")
        tagResult.tags.forEach { tag ->
            workIds.add(tag.workId)
        }

        // 作品IDで作品情報を取得
        val works = mutableListOf<Work>()
        workIds.forEach { workId ->
            val work = workRepository.findByWorkId(workId)
            logger.info("タグ検索での取得した作品: $work")
            works.add(work)
        }

        logger.info("最終的にタグ検索で取得した作品リスト: $works")
        return WorksWithSearchResult(
            works = works,
            totalCount = tagResult.totalCount
        )
    }

    @Transactional
    fun findWorksByFreeWords(
        words: List<String>?,
        offset: Int,
        limit: Int
    ): WorksWithSearchResult? {
        // 空のリストやnullチェック
        if (words.isNullOrEmpty()) {
            logger.info("入力されたワードが空、もしくはnullです。")
            return null
        }
        logger.info("入力されたワード: $words")

        // 各単語でフリーワード検索
        val workInfos = mutableListOf<WorkInfo>()
        // 完全一致でタグ検索
        val tagResults = tagService.findByTags(words)
        logger.info("フリーワード検索でのタグ検索結果: ${tagResults.map { it.workId }}")
        tagResults.forEach { tag ->
            workInfos.add(WorkInfo(tag.workId, tag.updatedAt))
        }

        val genreResults = workService.findByGenre(words)
        logger.info("フリーワード検索でのタグ検索結果: ${genreResults.map { it.workId }}")
        genreResults.forEach { genre ->
            workInfos.add(WorkInfo(genre.workId, genre.updatedAt))
        }

        val formatResults = workService.findByFormat(words)
        logger.info("フリーワード検索でのタグ検索結果: ${formatResults.map { it.workId }}")
        formatResults.forEach { format ->
            workInfos.add(WorkInfo(format.workId, format.updatedAt))
        }

        val characterResults = characterService.findByCharacters(words)
        logger.info("フリーワード検索でのタグ検索結果: ${characterResults.map { it.workId }}")
        characterResults.forEach { character ->
            workInfos.add(WorkInfo(character.workId, character.updatedAt))
        }

        val creatorResults = creatorService.findByCreators(words)
        logger.info("フリーワード検索でのタグ検索結果: ${creatorResults.map { it.workId }}")
        creatorResults.forEach { creator ->
            workInfos.add(WorkInfo(creator.workId, creator.updatedAt))
        }
        // ToDo: メインタイトル、サブタイトル、説明の部分一致検索

        val uniqueWorkInfos = workInfos.distinct()
        logger.info("ユニークな作品ID一覧: $uniqueWorkInfos")

        // updatedAt順にソート（降順）
        val sortedWorkInfos =
            uniqueWorkInfos.sortedByDescending { it.updatedAt }

        // offsetで指定した件数分スキップし、limit分だけ返す
        val filteredWorkInfos = sortedWorkInfos.drop(offset).take(limit)

        // 作品IDで作品情報を取得
        val works = mutableListOf<Work>()
        filteredWorkInfos.forEach { workInfo ->
            val work = workRepository.findByWorkId(workInfo.workId)
            logger.info("取得した作品: $work")
            works.add(work)
        }

        logger.info("最終的に取得した作品リスト: $works")
        return WorksWithSearchResult(
            works = works,
            totalCount = uniqueWorkInfos.size
        )
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
        work.workId = nextWorkId
        val formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")

        val titleImageAvif = try {
            convertService.toAvif(titleImage)
        } catch (e: Exception) {
            logger.error("Failed to convert title image to AVIF: ${e.message}")
            throw RuntimeException("Error during title image conversion")
        }

        val titleTimestamp = LocalDateTime.now().format(formatter)
        val titleImageUrl = uploadService.uploadToS3(
            titleImageAvif,
            "titleImage_$titleTimestamp.avif"
        )

        // 2. サムネイル生成とアップロード
        val thumbnailImageAvif = try {
            convertService.toThumbnail(titleImage)
        } catch (e: Exception) {
            logger.error("Failed to generate thumbnail: ${e.message}")
            throw RuntimeException("Error during thumbnail generation")
        }

        val thumbnailImageUrl = uploadService.uploadToS3(
            thumbnailImageAvif,
            "thumbnailImage_$titleTimestamp.avif"
        )

        logger.info("thumbnailImageAvif: $thumbnailImageAvif thumbnailImageUrl: $thumbnailImageUrl")

        // 2. ウォーターマスク生成とアップロード
        val watermaskImageAvif = try {
            convertService.toWatermask(titleImage)
        } catch (e: Exception) {
            logger.error("Failed to generate watermask: ${e.message}")
            throw RuntimeException("Error during watermask generation")
        }

        val watermaskImageUrl = uploadService.uploadToS3(
            watermaskImageAvif,
            "watermaskImage_$titleTimestamp.avif"
        )

        logger.info("thumbnailImageAvif: $watermaskImageUrl thumbnailImageUrl: $watermaskImageUrl")

        // ToDo: ImgURLはCloudFrontのURLに変換してDBに格納する
        work.titleImgUrl = titleImageUrl
        work.thumbnailImgUrl = thumbnailImageUrl
        work.watermaskImgUrl = watermaskImageUrl
        work.updatedAt = nowDate
        work.createdAt = nowDate
        workService.registerWork(work)

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
                convertService.toThumbnail(image)
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