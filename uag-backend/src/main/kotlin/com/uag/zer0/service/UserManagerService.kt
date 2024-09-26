package com.uag.zer0.service

import com.uag.zer0.dto.UsersActivity
import com.uag.zer0.dto.WorksWithSearchResult
import com.uag.zer0.entity.user.Liked
import com.uag.zer0.entity.user.Rated
import com.uag.zer0.entity.user.Viewed
import com.uag.zer0.entity.work.Work
import com.uag.zer0.repository.work.WorkRepository
import com.uag.zer0.service.user.LikedService
import com.uag.zer0.service.user.RatedService
import com.uag.zer0.service.user.ViewedService
import com.uag.zer0.service.work.CharacterService
import com.uag.zer0.service.work.CreatorService
import com.uag.zer0.service.work.TagService
import com.uag.zer0.service.work.WorkService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserManagerService(
    private val likedService: LikedService,
    private val retedService: RatedService,
    private val viewedService: ViewedService,
    private val workRepository: WorkRepository,
    private val workService: WorkService,
    private val tagService: TagService,
    private val characterService: CharacterService,
    private val creatorService: CreatorService
) {

    @Transactional
    fun searchUsersActivity(userId: String, workIds: List<Int>): UsersActivity {
        val liked = likedService.findByUserIdsAndWorkIds(userId, workIds)
        val rated = retedService.findByUserIdsAndWorkIds(userId, workIds)
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
            val work = workRepository.findByWorkId(liked.workId)
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
            tagService.findByTagsAsWork(words),
            workService.findByGenre(words),
            workService.findByFormat(words),
            characterService.findByCharactersAsWork(words),
            creatorService.findByCreatorsAsWork(words)
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
    fun registerUsersLiked(userId: String, workId: Int): Liked {
        return likedService.registerLiked(userId, workId)
    }

    @Transactional
    fun deleteUsersLiked(userId: String, workId: Int): Liked {
        return likedService.deleteLiked(userId, workId)
    }

    @Transactional
    fun getUsersRated(
        userId: String,
        offset: Int,
        limit: Int
    ): WorksWithSearchResult {
        val ratedWithSearchResult =
            retedService.findByUserIdWithOffset(userId, offset, limit)

        val works = mutableListOf<Work>()
        ratedWithSearchResult.rated.forEach { rated ->
            val work = workRepository.findByWorkId(rated.workId)
            works.add(work)
        }

        return WorksWithSearchResult(
            works = works,
            totalCount = ratedWithSearchResult.totalCount
        )
    }

    @Transactional
    fun registerUsersRated(userId: String, workId: Int, rating: Int): Rated {
        return retedService.registerRated(userId, workId, rating)
    }

    @Transactional
    fun deleteUsersRated(userId: String, workId: Int): Rated {
        return retedService.deleteRated(userId, workId)
    }

    @Transactional
    fun getUsersViewed(userId: String, offset: Int, limit: Int): List<Viewed> {
        return viewedService.findByUserIdWithOffset(userId, offset, limit)
    }

    @Transactional
    fun registerUsersViewed(userId: String, workId: Int): Viewed {
        return viewedService.registerViewed(userId, workId)
    }

    @Transactional
    fun deleteUsersViewed(userId: String, workId: Int): Viewed {
        return viewedService.deleteViewed(userId, workId)
    }
}