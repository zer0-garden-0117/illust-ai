package com.uag.zer0.service.user

import com.uag.zer0.entity.user.Rated
import com.uag.zer0.repository.user.RatedRepository
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class RatedService(
    private val ratedRepository: RatedRepository,
) {
    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByUserIdWithOffset(
        userId: String,
        offset: Int,
        limit: Int
    ): List<Rated> {
        val liked = ratedRepository.findByUserId(userId)

        // offsetで指定した件数分スキップし、limit分だけ返す
        return liked.drop(offset).take(limit)
    }

    fun findByUserIdsAndWorkIds(
        userId: String,
        workIds: List<Int>
    ): List<Rated> {
        val userIdWorkIdPairs = workIds.map { workId ->
            Pair(userId, workId)
        }
        return ratedRepository.findByUserIdsAndWorkIds(userIdWorkIdPairs)
    }

    fun registerRated(userId: String, workId: Int, rating: Int): Rated {
        val rated = Rated(
            userId = userId,
            workId = workId,
            rating = rating,
            updatedAt = Instant.now()
        )
        return ratedRepository.registerRated(rated)
    }

    fun deleteRated(userId: String, workId: Int): Rated {
        return ratedRepository.deleteRated(userId, workId)
    }
}