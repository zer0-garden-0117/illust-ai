package com.uag.zer0.controller

import com.uag.zer0.config.CustomAuthenticationToken
import com.uag.zer0.dto.UsersActivity
import com.uag.zer0.entity.user.User
import com.uag.zer0.generated.endpoint.UsersApi
import com.uag.zer0.generated.model.*
import com.uag.zer0.mapper.UserMapper
import com.uag.zer0.mapper.WorkMapper
import com.uag.zer0.service.TokenService
import com.uag.zer0.service.UserManagerService
import com.uag.zer0.service.user.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class UsersController(
    private val tokenService: TokenService,
    private val userService: UserService,
    private val userManagerService: UserManagerService,
    private val userMapper: UserMapper,
    private val workMapper: WorkMapper
) : UsersApi {

    private fun getUserId(): String? {
        val authentication: Authentication? =
            SecurityContextHolder.getContext().authentication
        val customAuth = authentication as? CustomAuthenticationToken
        return customAuth?.userId
    }

    override fun getUsersToken(): ResponseEntity<ApiUserToken> {
        val userId = getUserId() ?: return ResponseEntity.ok(
            ApiUserToken(userToken = "unregistered")
        )
        val currentUser: User =
            userService.hasUser(userId) ?: userService.registerUser(userId)
        val userToken = tokenService.generateToken(currentUser)
        return ResponseEntity.ok(ApiUserToken(userToken = userToken))
    }

    override fun postUsersActivitySearch(
        apiUsersActivitySearch: ApiUsersActivitySearch
    ): ResponseEntity<ApiUsersActivity> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val activityList =
            userManagerService.searchUsersActivity(
                userId,
                apiUsersActivitySearch.workIds
            )
        val apiUsersActivityList = toApiUsersActivity(activityList)
        return ResponseEntity.ok(apiUsersActivityList)
    }

    // いいね付与
    override fun postUsersLikedByWorkdId(workId: Int): ResponseEntity<ApiLiked> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val liked = userManagerService.registerUsersLiked(userId, workId)
        val apiLiked = userMapper.toApiLiked(liked)
        return ResponseEntity.ok(apiLiked)
    }

    // レーティング付与
    override fun postUsersRatedByWorkdId(
        @PathVariable workId: Int,
        @RequestBody apiRated: ApiRated
    ): ResponseEntity<ApiRated> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val rated = userManagerService.registerUsersRated(
            userId,
            workId,
            apiRated.rating ?: 0
        )
        val apiRatedResponse = userMapper.toApiRated(rated)
        return ResponseEntity.ok(apiRatedResponse)
    }

    // 閲覧済付与
    override fun postUsersViewedByWorkdId(workId: Int): ResponseEntity<ApiViewed> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val viewed = userManagerService.registerUsersViewed(userId, workId)
        val apiViewed = userMapper.toApiViewed(viewed)
        return ResponseEntity.ok(apiViewed)
    }

    // いいね削除
    override fun deleteUsersLikedByWorkdId(workId: Int): ResponseEntity<ApiLiked> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val liked = userManagerService.deleteUsersLiked(userId, workId)
        val apiLiked = userMapper.toApiLiked(liked)
        return ResponseEntity.ok(apiLiked)
    }

    // レーティング削除
    override fun deleteUsersRatedByWorkdId(workId: Int): ResponseEntity<ApiRated> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val rated = userManagerService.deleteUsersRated(userId, workId)
        val apiRated = userMapper.toApiRated(rated)
        return ResponseEntity.ok(apiRated)
    }

    // 閲覧済削除
    override fun deleteUsersViewedByWorkdId(workId: Int): ResponseEntity<ApiViewed> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val viewed = userManagerService.deleteUsersViewed(userId, workId)
        val apiViewed = userMapper.toApiViewed(viewed)
        return ResponseEntity.ok(apiViewed)
    }

    // いいね取得
    override fun getUsersLiked(
        offset: Int,
        limit: Int
    ): ResponseEntity<ApiWorksWithSearchResult> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val likedResult =
            userManagerService.getUsersLiked(userId, offset, limit)

        val apiWorks = mutableListOf<ApiWork>()
        likedResult.works.forEach { work ->
            val apiWork = workMapper.toApiWork(work)
            apiWorks.add(apiWork)
        }
        val apiWorkWithDetails = ApiWorksWithSearchResult(
            works = apiWorks,
            totalCount = likedResult.totalCount ?: 0
        )
        return ResponseEntity.ok(apiWorkWithDetails)
    }

    // レーティング取得
    override fun getUsersRated(
        offset: Int,
        limit: Int
    ): ResponseEntity<ApiWorksWithSearchResult> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val ratedList =
            userManagerService.getUsersRated(userId, offset, limit)

        val apiWorks = mutableListOf<ApiWork>()
        ratedList.works.forEach { work ->
            val apiWork = workMapper.toApiWork(work)
            apiWorks.add(apiWork)
        }
        val apiWorkWithDetails = ApiWorksWithSearchResult(
            works = apiWorks,
            totalCount = ratedList.totalCount ?: 0
        )
        return ResponseEntity.ok(apiWorkWithDetails)
    }

    // 閲覧済取得
    override fun getUsersViewed(
        offset: Int,
        limit: Int
    ): ResponseEntity<List<ApiViewed>> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val viewedList =
            userManagerService.getUsersViewed(userId, offset, limit)
        val apiViewed = mutableListOf<ApiViewed>()
        viewedList.forEach { viewed ->
            apiViewed.add(userMapper.toApiViewed(viewed))
        }
        return ResponseEntity.ok(apiViewed)
    }

    fun toApiUsersActivity(activityList: UsersActivity): ApiUsersActivity {
        val apiLiked = mutableListOf<ApiLiked>()
        activityList.liked.forEach { liked ->
            apiLiked.add(userMapper.toApiLiked(liked))
        }
        val apiRated = mutableListOf<ApiRated>()
        activityList.rated.forEach { rated ->
            apiRated.add(userMapper.toApiRated(rated))
        }
        return ApiUsersActivity(
            apiLikeds = apiLiked,
            apiRateds = apiRated
        )
    }
}