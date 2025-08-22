package com.ila.zer0.service.user

import com.ila.zer0.dto.RatedWithSearchResult
import com.ila.zer0.entity.Rated
import com.ila.zer0.entity.Work
import com.ila.zer0.repository.RatedRepository
import org.springframework.stereotype.Service
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException
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
    ): RatedWithSearchResult {
        val rated = ratedRepository.findByUserId(userId)

        // offsetで指定した件数分スキップしlimit分だけ取得
        val filteredRated = rated.drop(offset).take(limit)
        val count = rated.size

        return RatedWithSearchResult(
            rated = filteredRated,
            totalCount = count
        )
    }

    fun findByUserIdsAndWorkIds(
        userId: String,
        workIds: List<String>
    ): List<Rated> {
        val userIdWorkIdPairs = workIds.map { workId ->
            Pair(userId, workId)
        }
        return ratedRepository.findByUserIdsAndWorkIds(userIdWorkIdPairs)
    }

    fun findByUserIdAndWorkId(userId: String, workId: String): Rated? {
        return ratedRepository.findByUserIdAndWorkId(userId, workId)
    }

    fun registerRated(userId: String, workId: String, rating: Int): Rated {
        val rated = Rated(
            userId = userId,
            workId = workId,
            rating = rating,
            updatedAt = Instant.now()
        )
        return ratedRepository.registerRated(rated)
    }

    fun deleteRated(userId: String, workId: String): Rated {
        return ratedRepository.deleteRated(userId, workId)
    }

    fun deleteWork(workId: String) {
        return ratedRepository.deleteWork(workId)
    }

    fun deleteUser(userId: String) {
        return ratedRepository.deleteUserIdById(userId)
    }
}