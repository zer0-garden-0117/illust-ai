package com.cfa.zer0.service.user

import com.cfa.zer0.dto.UsersActivity
import com.cfa.zer0.dto.WorksWithSearchResult
import com.cfa.zer0.entity.Liked
import com.cfa.zer0.entity.Rated
import com.cfa.zer0.entity.Work
import com.cfa.zer0.service.CognitoService
import com.cfa.zer0.service.tag.TagService
import com.cfa.zer0.service.work.WorkService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserManagerService(
    private val likedService: LikedService,
    private val ratedService: RatedService,
    private val workService: WorkService,
    private val tagService: TagService,
    private val cognitoService: CognitoService
) {

    @Transactional
    fun searchUsersActivity(
        userId: String,
        workIds: MutableList<String>
    ): UsersActivity {
        val liked = likedService.findByUserIdsAndWorkIds(userId, workIds)
        val rated = ratedService.findByUserIdsAndWorkIds(userId, workIds)
        return UsersActivity(
            liked = liked,
            rated = rated
        )
    }

    @Transactional
    fun getUsersLiked(
        userId: String,
        offset: Int,
        limit: Int
    ): WorksWithSearchResult {
        val likedWithSearchResult =
            likedService.findByUserIdWithOffset(userId, offset, limit)

        val works = mutableListOf<Work>()
        likedWithSearchResult.liked.forEach { liked ->
            val work = workService.findWorkById(liked.workId)
            works.add(work)
        }

        return WorksWithSearchResult(
            works = works,
            totalCount = likedWithSearchResult.totalCount
        )
    }

    @Transactional
    fun getUsersLikedWithFilter(
        userId: String,
        offset: Int,
        limit: Int,
        words: List<String>
    ): WorksWithSearchResult {
        val likeds = likedService.findByUserId(userId)
        val likedWorkIds = likeds.map { it.workId }.toSet()

        // 各検索サービスから結果を取得
        val searchResults = listOf(
            tagService.findByTagsAsWork(words)
        )

        val workIds = searchResults
            .flatMap { results ->
                results.filter { likedWorkIds.contains(it.workId) }.map { it }
            }
            .distinct()

        // updatedAt順にソート（降順）
        val sortedWorkIds =
            workIds.sortedByDescending { it.updatedAt }

        // offsetで指定した件数分スキップし、limit分だけ返す
        val filteredWorkIds = sortedWorkIds.drop(offset).take(limit)

        return WorksWithSearchResult(
            works = filteredWorkIds,
            totalCount = sortedWorkIds.size
        )
    }

    @Transactional
    fun registerUsersLiked(userId: String, workId: String): Liked {
        val liked = likedService.registerLiked(userId, workId)
        workService.addLikedToWork(workId)
        return liked
    }

    @Transactional
    fun deleteUsersLiked(userId: String, workId: String): Liked {
        val liked =  likedService.deleteLiked(userId, workId)
        workService.deleteLikedToWork(workId)
        return liked
    }

    @Transactional
    fun getUsersRated(
        userId: String,
        offset: Int,
        limit: Int
    ): WorksWithSearchResult {
        val ratedWithSearchResult =
            ratedService.findByUserIdWithOffset(userId, offset, limit)

        val works = mutableListOf<Work>()
        ratedWithSearchResult.rated.forEach { rated ->
            val work = workService.findWorkById(rated.workId)
            works.add(work)
        }

        return WorksWithSearchResult(
            works = works,
            totalCount = ratedWithSearchResult.totalCount
        )
    }

    @Transactional
    fun registerUsersRated(userId: String, workId: String, rating: Int): Rated {
        val oldRate = ratedService.findByUserIdAndWorkId(userId, workId)
        val rated = ratedService.registerRated(userId, workId, rating)
        workService.addRatingToWork(workId, oldRate?.rating, rating)
        return rated
    }

    @Transactional
    fun deleteUsersRated(userId: String, workId: String): Rated {
        return ratedService.deleteRated(userId, workId)
    }

    @Transactional
    fun deleteWorkId(workId: String) {
        // likedテーブルから削除
        likedService.deleteWork(workId)
        // ratedテーブルから削除
        ratedService.deleteWork(workId)
    }

    @Transactional
    fun deleteUsers(userId: String) {
        likedService.deleteUser(userId)
        ratedService.deleteUser(userId)
        cognitoService.deleteAllUsersByUserIdSilently(userId)
    }
}