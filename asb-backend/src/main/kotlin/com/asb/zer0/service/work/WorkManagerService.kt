package com.asb.zer0.service.work

import com.asb.zer0.dto.WorkWithTag
import com.asb.zer0.dto.WorksWithSearchResult
import com.asb.zer0.entity.Tag
import com.asb.zer0.entity.Work
import com.asb.zer0.repository.TagRepository
import com.asb.zer0.repository.WorkRepository
import com.asb.zer0.service.CdnUrlService
import com.asb.zer0.service.ConvertService
import com.asb.zer0.service.UploadService
import com.asb.zer0.service.UuidService
import com.asb.zer0.service.tag.TagService
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
    private val convertService: ConvertService,
    private val uploadService: UploadService,
    private val cdnUrlService: CdnUrlService,
    private val uuidService: com.asb.zer0.service.UuidService
) {

    private val logger = LoggerFactory.getLogger(WorkService::class.java)

    @Transactional
    fun findWorkById(workId: String): WorkWithTag {
        val work = workService.findWorkById(workId)
        val tag = tagService.findByWorkIds(workId)
        return WorkWithTag(
            work = work,
            tags = tag
        )
    }

    @Transactional
    fun findLatestWorks(numberOfWorks: Int): WorksWithSearchResult? {
        // 全作品共通タグ「GLOBAL」で検索
        val tags = listOf("GLOBAL")
        val offset = 0
        return findWorksByTags(tags, offset, numberOfWorks)
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
        val workIds = mutableListOf<String>()
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
    fun registerWork(
        work: Work,
        tags: List<Tag>,
        titleImage: MultipartFile,
        images: List<MultipartFile>
    ): WorkWithTag {
        // 初期化
        val nowDate = Instant.now()
        val formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")

        // workId取得
        val nextWorkId = uuidService.generateUuid()
        work.workId = nextWorkId

        // タイトル画像の生成、アップロード、URL生成
        if (titleImage.isEmpty) {
            logger.error("Title image is empty.")
            throw IllegalArgumentException("Title image cannot be empty.")
        }
        val titleTimestamp = LocalDateTime.now().format(formatter)
        val titleImageAvif = try {
            convertService.toAvif(titleImage)
        } catch (e: Exception) {
            logger.error("Failed to convert title image to AVIF: ${e.message}")
            throw RuntimeException("Error during title image conversion")
        }
        val titleImageUrl = uploadService.uploadToS3(
            titleImageAvif,
            "titleImage_$titleTimestamp.avif"
        )
        val titleCdnUrl = cdnUrlService.convertToCdnUrl(titleImageUrl)

        // サムネイル画像の生成、アップロード、URL生成
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
        val thumbnailCdnUrl = cdnUrlService.convertToCdnUrl(thumbnailImageUrl)

        // ウォーターマスクの生成、アップロード、URL生成
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
        logger.info("watermaskImageAvif: $watermaskImageUrl watermaskImageUrl: $watermaskImageUrl")
        val watermaskCdnUrl = cdnUrlService.convertToCdnUrl(watermaskImageUrl)

        // 作品の登録
        work.titleImgUrl = titleCdnUrl
        work.thumbnailImgUrl = thumbnailCdnUrl
        work.watermaskImgUrl = watermaskCdnUrl
        work.updatedAt = nowDate
        work.createdAt = nowDate
        workService.registerWork(work)

        // タグの登録
        val filteredTags = tags.filter { it.tag.isNotBlank() }
        val globalTag = Tag().apply {
            tag = "other_GLOBAL"
        }
        val allTags = filteredTags + globalTag
        allTags.forEach { tag ->
            tag.workId = nextWorkId
            tag.updatedAt = nowDate
        }
        tagRepository.registerTags(allTags)

        // WorkWithDetailsの生成、返却
        return WorkWithTag(
            work = work,
            tags = tags,
        )
    }

    @Transactional
    fun deleteWorkById(workId: String): WorkWithTag {
        // 作品の取得
        val work = workRepository.findByWorkId(workId)
        val tags = tagRepository.findByWorkId(workId)

        // workテーブルから削除
        workService.deleteWorkById(workId)

        // tagテーブルから削除
        tagRepository.deleteTagByWorkId(workId)

        return WorkWithTag(
            work = work,
            tags = tags
        )
    }
}