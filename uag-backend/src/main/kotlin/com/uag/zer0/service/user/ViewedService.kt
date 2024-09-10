package com.uag.zer0.service.user

import com.uag.zer0.entity.user.Viewed
import com.uag.zer0.repository.user.ViewedRepository
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class ViewedService(
    private val viewedRepository: ViewedRepository,
) {
    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByUserIdWithOffset(
        userId: String,
        offset: Int,
        limit: Int
    ): List<Viewed> {
        val liked = viewedRepository.findByUserId(userId)

        // offsetで指定した件数分スキップし、limit分だけ返す
        return liked.drop(offset).take(limit)
    }

    fun registerViewed(userId: String, workId: Int): Viewed {
        val viewed = Viewed(
            userId = userId,
            workId = workId,
            updatedAt = Instant.now()
        )
        return viewedRepository.registerViewed(viewed)
    }

    fun deleteViewed(userId: String, workId: Int): Viewed {
        return viewedRepository.deleteViewed(userId, workId)
    }
}