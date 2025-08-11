package com.cfa.zer0.service.work

import com.cfa.zer0.dto.WorkWithTag
import com.cfa.zer0.dto.WorksWithSearchResult
import com.cfa.zer0.entity.Tag
import com.cfa.zer0.entity.Work
import com.cfa.zer0.repository.TagRepository
import com.cfa.zer0.repository.WorkRepository
import com.cfa.zer0.service.SqsService
import com.cfa.zer0.service.tag.TagService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class WorkManagerService(
    private val workRepository: WorkRepository,
    private val workService: WorkService,
    private val tagRepository: TagRepository,
    private val tagService: TagService,
    private val sqsService: SqsService,
    private val uuidService: com.cfa.zer0.service.UuidService
) {

    private val logger = LoggerFactory.getLogger(WorkService::class.java)

    @Transactional
    fun createWork(work: Work, tags: List<Tag>): WorkWithTag {
        // 作品の登録
        val nowDate = Instant.now()
        val workId = uuidService.generateUuid()
        work.workId = workId
        work.updatedAt = nowDate
        work.createdAt = nowDate
        workService.registerWork(work)

        // タグの登録
        val filteredTags = tags.filter { it.tag.isNotBlank() }
        val globalTag = Tag().apply { tag = "other_GLOBAL" }
        val allTags = filteredTags + globalTag
        allTags.forEach { tag ->  tag.workId = workId; tag.updatedAt = nowDate }
        tagRepository.registerTags(allTags)

        // 画像生成SQS通知
        sqsService.sendCreateImageMessage(work.workId, "create", work.prompt, work.createdAt)

        return WorkWithTag(work, tags)
    }

    @Transactional
    fun updateWork(updatedWork: Work): Work {
        workService.updateWork(updatedWork)
        return updatedWork
    }

    @Transactional
    fun findWorkById(workId: String): com.cfa.zer0.dto.WorkWithTag {
        val work = workService.findWorkById(workId)
        val tags = tagService.findByWorkIds(workId)
        return WorkWithTag(work, tags)
    }

    @Transactional
    fun findWorksByTags(words: List<String>?, offset: Int, limit: Int): WorksWithSearchResult? {
        // 空のリストやnullチェック
        if (words.isNullOrEmpty()) {
            logger.info("入力されたタグが空、もしくはnullです。")
            return null
        }

        // 各単語でタグ検索
        val workIds = mutableListOf<String>()
        val tagResult = tagService.findByTagsWithOffset(words, offset, limit)
        tagResult.tags.forEach { tag ->
            workIds.add(tag.workId)
        }

        // 作品IDで作品情報を取得
        val works = mutableListOf<Work>()
        workIds.forEach { workId ->
            val work = workRepository.findByWorkId(workId)
            works.add(work)
        }

        return WorksWithSearchResult(works, tagResult.totalCount)
    }

    @Transactional
    fun deleteWorkById(workId: String): com.cfa.zer0.dto.WorkWithTag {
        // 作品の取得
        val work = workRepository.findByWorkId(workId)
        val tags = tagRepository.findByWorkId(workId)

        // workテーブルから削除
        workService.deleteWorkById(workId)

        // tagテーブルから削除
        tagRepository.deleteTagByWorkId(workId)

        return com.cfa.zer0.dto.WorkWithTag(
            work = work,
            tags = tags
        )
    }
}