package com.uag.zer0.service.work

import com.uag.zer0.entity.work.Work
import com.uag.zer0.repository.work.WorkRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class WorkService(
    private val workRepository: WorkRepository,
) {

    private val logger = LoggerFactory.getLogger(WorkService::class.java)

    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByGenreWithOffset(
        genres: List<String>,
        offset: Int,
        limit: Int
    ): List<Work> {
        val allTags = genres.flatMap { workRepository.findByGenre(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allTags.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        // offsetで指定した件数分スキップし、limit分だけ返す
        return sortedTags.drop(offset).take(limit)
    }

    fun findWorksByIds(workIds: List<Int>): List<Work> {
        val works = mutableListOf<Work>()
        workIds.forEach { workId ->
            works.add(workRepository.findByWorkId(workId))
        }
        return works
    }

    fun findByGenre(
        genres: List<String>,
    ): List<Work> {
        val allTags = genres.flatMap { workRepository.findByGenre(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allTags.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        return sortedTags
    }

    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByFormatWithOffset(
        formats: List<String>,
        offset: Int,
        limit: Int
    ): List<Work> {
        val allTags = formats.flatMap { workRepository.findByFormat(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allTags.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        // offsetで指定した件数分スキップし、limit分だけ返す
        return sortedTags.drop(offset).take(limit)
    }

    fun findByFormat(
        formats: List<String>,
    ): List<Work> {
        val allTags = formats.flatMap { workRepository.findByFormat(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allTags.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        return sortedTags
    }
}