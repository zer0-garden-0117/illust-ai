package com.ila.zer0.service.tag

import com.ila.zer0.dto.TagsWithSearchResult
import com.ila.zer0.entity.Tag
import com.ila.zer0.entity.Work
import com.ila.zer0.repository.TagRepository
import com.ila.zer0.repository.WorkRepository
import org.springframework.stereotype.Service
import java.text.Normalizer

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

    // workId、descriptionを引数にタグを登録
    // descriptionは #から始まる語をタグとして登録（日本語・全角英数・絵文字対応）
    fun registerTagsFromDescription(
        workId: String,
        description: String,
        isFirstUpdate: Boolean
    ) {
        // 正規化（全角/半角の差異を吸収、合成文字を統一）
        val normalized = Normalizer.normalize(description, Normalizer.Form.NFKC)

        // タグに含めてよい文字クラス
        // - \p{L}\p{N}: 全世界の文字・数字
        // - Script=Hiragana/Katakana/Han: 日本語
        // - 全角英数: FF10-FF19, FF21-FF3A, FF41-FF5A
        // - 長音・中黒: ー ・ ･
        // - Emoji主要面: 1F300-1FAFF, 補助: 2600-26FF, 2700-27BF
        // - 絵文字修飾/連結: FE0F(emoji variation), 200D(ZWJ), 1F3FB-1F3FF(肌色), 20E3(keycap)
        val tagCharClass =
            "\\p{L}\\p{N}_" +
                    "\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Han}" +
                    "\\x{FF10}-\\x{FF19}\\x{FF21}-\\x{FF3A}\\x{FF41}-\\x{FF5A}" +
                    "ー・･" +
                    "\\x{1F300}-\\x{1FAFF}\\x{2600}-\\x{26FF}\\x{2700}-\\x{27BF}" +
                    "\\x{FE0F}\\x{200D}\\x{1F3FB}-\\x{1F3FF}\\x{20E3}"

        // `#` に続く上記クラスの 1 文字以上をタグ本体として取得
        val regex = Regex("#([$tagCharClass]+)")

        val tags = regex.findAll(normalized)
            .map { it.groupValues[1] }
            .map { it.trim() }
            .filter { it.isNotEmpty() }
            // 任意: 長すぎるタグを制限（例: 64文字）
            .map { if (it.length > 64) it.substring(0, 64) else it }
            // 任意: 大文字小文字を畳むなら .lowercase()（日本語には影響なし）
            //.map { it.lowercase() }
            .distinct()
            .map { tag ->
                Tag(
                    workId = workId,
                    tag = tag
                )
            }
            .toMutableList()

        // "GLOBAL"タグを追加
        tags.add(
            Tag(
                workId = workId,
                tag = "GLOBAL"
            )
        )

        // 初回更新ではない場合、前のタグがあれば削除
        if (!isFirstUpdate) {
            val prevTags = tagRepository.findByWorkId(workId)
            if (prevTags.isNotEmpty()) {
                tagRepository.deleteTagByWorkId(workId)
            }
        }

        // タグ登録
        tagRepository.registerTags(tags)
    }
}