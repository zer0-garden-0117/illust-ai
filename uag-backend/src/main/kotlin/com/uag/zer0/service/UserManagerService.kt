package com.uag.zer0.service

import com.uag.zer0.dto.UsersActivity
import com.uag.zer0.entity.user.Liked
import com.uag.zer0.entity.user.Rated
import com.uag.zer0.entity.user.Viewed
import com.uag.zer0.service.user.LikedService
import com.uag.zer0.service.user.RatedService
import com.uag.zer0.service.user.ViewedService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserManagerService(
    private val likedService: LikedService,
    private val retedService: RatedService,
    private val viewedService: ViewedService
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
    fun getUsersLiked(userId: String, offset: Int, limit: Int): List<Liked> {
        return likedService.findByUserIdWithOffset(userId, offset, limit)
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
    fun getUsersRated(userId: String, offset: Int, limit: Int): List<Rated> {
        return retedService.findByUserIdWithOffset(userId, offset, limit)
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