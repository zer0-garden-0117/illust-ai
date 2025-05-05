package com.asb.zer0.service.work

import com.asb.zer0.dto.WorkWithTag
import com.asb.zer0.dto.WorksWithSearchResult
import com.asb.zer0.entity.Tag
import com.asb.zer0.entity.Work
import com.asb.zer0.repository.TagRepository
import com.asb.zer0.repository.WorkRepository
import com.asb.zer0.service.CdnService
import com.asb.zer0.service.ConvertService
import com.asb.zer0.service.S3Service
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
    private val s3Service: S3Service,
    private val cdnService: CdnService,
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
        val titleImageUrl = s3Service.uploadToS3(
            titleImageAvif,
            nextWorkId + "_titleImage.avif"
        )
        val titleCdnUrl = cdnService.convertToCdnUrl(titleImageUrl)

        // サムネイル画像の生成、アップロード、URL生成
        val thumbnailImageAvif = try {
            convertService.toThumbnail(titleImage)
        } catch (e: Exception) {
            logger.error("Failed to generate thumbnail: ${e.message}")
            throw RuntimeException("Error during thumbnail generation")
        }
        val thumbnailImageUrl = s3Service.uploadToS3(
            thumbnailImageAvif,
            nextWorkId + "_thumbnailImage.avif"
        )
        logger.info("thumbnailImageAvif: $thumbnailImageAvif thumbnailImageUrl: $thumbnailImageUrl")
        val thumbnailCdnUrl = cdnService.convertToCdnUrl(thumbnailImageUrl)

        // ウォーターマスクの生成、アップロード、URL生成
        val watermaskImageAvif = try {
            convertService.toWatermask(titleImage)
        } catch (e: Exception) {
            logger.error("Failed to generate watermask: ${e.message}")
            throw RuntimeException("Error during watermask generation")
        }
        val watermaskImageUrl = s3Service.uploadToS3(
            watermaskImageAvif,
            nextWorkId + "_watermaskImage.avif"
        )
        logger.info("watermaskImageAvif: $watermaskImageAvif watermaskImageUrl: $watermaskImageUrl")
        val watermaskCdnUrl = cdnService.convertToCdnUrl(watermaskImageUrl)

        // OGP用のJPEG生成、アップロード
        val ogpImageJpeg = try {
            convertService.toJpeg(titleImage)
        } catch (e: Exception) {
            logger.error("Failed to generate jpeg: ${e.message}")
            throw RuntimeException("Error during jpeg generation")
        }
        val ogpImageUrl = s3Service.uploadToS3(
            ogpImageJpeg,
            nextWorkId + "_ogpImage.jpeg"
        )
        logger.info("ogpImageJpeg: $ogpImageJpeg ogpImageUrl: $ogpImageUrl")

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