package com.uag.zer0.service.work

import com.uag.zer0.entity.work.Character
import com.uag.zer0.entity.work.Work
import com.uag.zer0.repository.work.CharacterRepository
import com.uag.zer0.repository.work.WorkRepository
import org.springframework.stereotype.Service

@Service
class CharacterService(
    private val characterRepository: CharacterRepository,
    private val workRepository: WorkRepository
) {
    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByCharactersWithOffset(
        characters: List<String>,
        offset: Int,
        limit: Int
    ): List<Character> {
        val allCreators =
            characters.flatMap { characterRepository.findByCharacter(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allCreators.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        // offsetで指定した件数分スキップし、limit分だけ返す
        return sortedTags.drop(offset).take(limit)
    }

    fun findByCharacters(
        characters: List<String>,
    ): List<Character> {
        val allCreators =
            characters.flatMap { characterRepository.findByCharacter(it) }

        // 重複削除 (workId を基準にする)
        val uniqueTags = allCreators.distinctBy { it.workId }

        // updatedAt順にソート（降順）
        val sortedTags = uniqueTags.sortedByDescending { it.updatedAt }

        return sortedTags
    }

    fun findByCharactersAsWork(
        characters: List<String>,
    ): List<Work> {
        val allCreators =
            characters.flatMap { characterRepository.findByCharacter(it) }

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