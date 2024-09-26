package com.uag.zer0.service.work

import com.uag.zer0.entity.work.Creator
import com.uag.zer0.entity.work.Work
import com.uag.zer0.repository.work.CreatorRepository
import com.uag.zer0.repository.work.WorkRepository
import org.springframework.stereotype.Service

@Service
class CreatorService(
    private val creatorRepository: CreatorRepository,
    private val workRepository: WorkRepository
) {
    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByCreatorsWithOffset(
        creators: List<String>,
        offset: Int,
        limit: Int
    ): List<Creator> {
        val allCreators =
            creators.flatMap { creatorRepository.findByCreator(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allCreators.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        // offsetで指定した件数分スキップし、limit分だけ返す
        return sortedTags.drop(offset).take(limit)
    }

    fun findByCreators(
        creators: List<String>,
    ): List<Creator> {
        val allCreators =
            creators.flatMap { creatorRepository.findByCreator(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allCreators.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        return sortedTags
    }

    fun findByCreatorsAsWork(
        creators: List<String>,
    ): List<Work> {
        val allCreators =
            creators.flatMap { creatorRepository.findByCreator(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allCreators.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        val works = mutableListOf<Work>()
        sortedTags.forEach { tag ->
            works.add(workRepository.findByWorkId(tag.workId))
        }

        return works
    }
}