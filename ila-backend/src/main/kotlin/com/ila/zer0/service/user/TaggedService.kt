package com.ila.zer0.service.user

import com.ila.zer0.dto.TaggedWithSearchResult
import com.ila.zer0.repository.TaggedRepository
import org.springframework.stereotype.Service

@Service
class TaggedService(
    private val taggedRepository: TaggedRepository
) {
    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByUserIdWithOffset(
        userId: String,
        offset: Int,
        limit: Int
    ): TaggedWithSearchResult {
        val taggeds = taggedRepository.findByUserId(userId)

        // followsの順番を更新日時の降順にソート
        val sortedTaggeds = taggeds.sortedByDescending { it.updatedAt }

        // offsetで指定した件数分スキップしlimit分だけ取得
        val filteredTaggeds = sortedTaggeds.drop(offset).take(limit)
        return TaggedWithSearchResult(
            taggeds = filteredTaggeds,
            totalCount = taggeds.size
        )
    }
}