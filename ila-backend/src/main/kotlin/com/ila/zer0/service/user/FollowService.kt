package com.ila.zer0.service.user

import com.ila.zer0.dto.FollowWithSearchResult
import com.ila.zer0.entity.Follow
import com.ila.zer0.repository.FollowRepository
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class FollowService(
    private val followRepository: FollowRepository,
) {
    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByUserIdWithOffset(
        userId: String,
        offset: Int,
        limit: Int
    ): FollowWithSearchResult {
        val follows = followRepository.findByUserId(userId)

        // offsetで指定した件数分スキップしlimit分だけ取得
        val filteredFollows = follows.drop(offset).take(limit)
        val count = follows.size
        return FollowWithSearchResult(
            follows = filteredFollows,
            totalCount = count
        )
    }

    fun findByUserId(userId: String): List<Follow> {
        return followRepository.findByUserId(userId)
    }

    fun getFollowCount(userId: String): Int {
        val follows =  followRepository.findByUserId(userId)
        return follows.size
    }

    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByFollowUserIdWithOffset(
        userId: String,
        offset: Int,
        limit: Int
    ): FollowWithSearchResult {
        val follows = followRepository.findByFollowUserId(userId)

        // offsetで指定した件数分スキップしlimit分だけ取得
        val filteredFollows = follows.drop(offset).take(limit)
        val count = follows.size
        return FollowWithSearchResult(
            follows = filteredFollows,
            totalCount = count
        )
    }

    fun findByFollowUserId(userId: String): List<Follow> {
        return followRepository.findByFollowUserId(userId)
    }

    fun getFollowerCount(userId: String): Int {
        val followers =  followRepository.findByFollowUserId(userId)
        return followers.size
    }

    fun registerFollow(userId: String, followUserId: String): Follow {
        val follow = Follow(
            userId = userId,
            followUserId = followUserId,
            updatedAt = Instant.now()
        )
        return followRepository.registerFollow(follow)
    }

    fun deleteFollow(userId: String, followUserId: String): Follow {
        return followRepository.deleteFollow(userId, followUserId)
    }

    fun deleteUser(userId: String) {
        return followRepository.deleteAllByUserId(userId)
    }

}