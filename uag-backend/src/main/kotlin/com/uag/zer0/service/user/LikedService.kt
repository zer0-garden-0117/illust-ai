package com.uag.zer0.service.user

import com.uag.zer0.entity.user.Liked
import com.uag.zer0.repository.user.LikedRepository
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class LikedService(
    private val likedRepository: LikedRepository,
) {
    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByUserIdWithOffset(
        userId: String,
        offset: Int,
        limit: Int
    ): List<Liked> {
        val liked = likedRepository.findByUserId(userId)

        // offsetで指定した件数分スキップし、limit分だけ返す
        return liked.drop(offset).take(limit)
    }

    fun findByUserIdsAndWorkIds(
        userId: String,
        workIds: List<Int>
    ): List<Liked> {
        val userIdWorkIdPairs = workIds.map { workId ->
            Pair(userId, workId)
        }
        return likedRepository.findByUserIdsAndWorkIds(userIdWorkIdPairs)
    }

    fun registerLiked(userId: String, workId: Int): Liked {
        val liked = Liked(
            userId = userId,
            workId = workId,
            updatedAt = Instant.now()
        )
        return likedRepository.registerLiked(liked)
    }

    fun deleteLiked(userId: String, workId: Int): Liked {
        return likedRepository.deleteLiked(userId, workId)
    }
}