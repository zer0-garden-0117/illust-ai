package com.ila.zer0.service.user

import com.ila.zer0.dto.LikedWithSearchResult
import com.ila.zer0.entity.Liked
import com.ila.zer0.entity.Work
import com.ila.zer0.repository.LikedRepository
import org.springframework.stereotype.Service
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import java.time.Instant

@Service
class LikedService(
    private val likedRepository: LikedRepository
) {
    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByUserIdWithOffset(
        userId: String,
        offset: Int,
        limit: Int
    ): LikedWithSearchResult {
        val liked = likedRepository.findByUserId(userId)

        // offsetで指定した件数分スキップしlimit分だけ取得
        val filteredLiked = liked.drop(offset).take(limit)
        val count = liked.size
        return LikedWithSearchResult(
            liked = filteredLiked,
            totalCount = count
        )
    }

    fun findByUserId(userId: String): List<Liked> {
        return likedRepository.findByUserId(userId)
    }

    fun findByUserIdsAndWorkIds(
        userId: String,
        workIds: List<String>
    ): List<Liked> {
        val userIdWorkIdPairs = workIds.map { workId ->
            Pair(userId, workId)
        }
        return likedRepository.findByUserIdsAndWorkIds(userIdWorkIdPairs)
    }

    fun findByWorkId(
        workId: String,
    ): List<Liked> {
        val allLikeds = likedRepository.findByWorkId(workId)

        // updatedAt順にソート（降順）
        val sortedLikeds = allLikeds.sortedByDescending { it.updatedAt }

        return sortedLikeds
    }

    fun registerLiked(userId: String, workId: String): Liked {
        val liked = Liked(
            userId = userId,
            workId = workId,
            updatedAt = Instant.now()
        )
        return likedRepository.registerLiked(liked)
    }

    fun deleteLiked(userId: String, workId: String): Liked {
        return likedRepository.deleteLiked(userId, workId)
    }

    fun deleteWork(workId: String) {
        return likedRepository.deleteWork(workId)
    }

    fun deleteUser(userId: String) {
        return likedRepository.deleteUserIdById(userId)
    }
}