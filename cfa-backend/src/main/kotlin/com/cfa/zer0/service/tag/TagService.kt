package com.cfa.zer0.service.tag

import com.cfa.zer0.dto.TagsWithSearchResult
import com.cfa.zer0.entity.Tag
import com.cfa.zer0.entity.Work
import com.cfa.zer0.repository.TagRepository
import com.cfa.zer0.repository.WorkRepository
import org.springframework.stereotype.Service

@Service
class TagService(
    private val tagRepository: TagRepository,
    private val workRepository: WorkRepository
) {
    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByTagsWithOffset(
        tags: List<String>,
        offset: Int,
        limit: Int
    ): TagsWithSearchResult {
        val allTags = tags.flatMap { tagRepository.findByTag(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allTags.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        // offsetで指定した件数分スキップし、limit分だけ返す
        val filteredTags = sortedTags.drop(offset).take(limit)
        val count = sortedTags.size
        return TagsWithSearchResult(
            tags = filteredTags,
            totalCount = count
        )
    }

    fun findByWorkIds(
        workId: String,
    ): List<Tag> {
        val allTags = tagRepository.findByWorkId(workId)

        // updatedAt順にソート（降順）
        val sortedTags = allTags.sortedByDescending { it.updatedAt }

        return sortedTags
    }

    fun findByTags(
        tags: List<String>,
    ): List<Tag> {
        val allTags = tags.flatMap { tagRepository.findByTag(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allTags.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        return sortedTags
    }

    fun findByTagsAsWork(
        tags: List<String>,
    ): List<Work> {
        val allTags = tags.flatMap { tagRepository.findByTag(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allTags.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        val works = mutableListOf<Work>()
        sortedTags.forEach { tag ->
            works.add(workRepository.findByWorkId(tag.workId))
        }

        return works
    }
}