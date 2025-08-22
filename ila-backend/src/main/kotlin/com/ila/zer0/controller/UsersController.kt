package com.ila.zer0.controller

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.dto.UsersActivity
import com.ila.zer0.generated.endpoint.UsersApi
import com.ila.zer0.generated.model.*
import com.ila.zer0.mapper.UserMapper
import com.ila.zer0.mapper.WorkMapper
import com.ila.zer0.service.CognitoService
import com.ila.zer0.service.UserTokenService
import com.ila.zer0.service.user.UserManagerService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class UsersController(
    private val userTokenService: UserTokenService,
    private val userManagerService: UserManagerService,
    private val cognitoService: CognitoService,
    private val userMapper: UserMapper,
    private val workMapper: WorkMapper
) : com.ila.zer0.generated.endpoint.UsersApi {

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
        val userToken = userTokenService.generateToken(userId)
        return ResponseEntity.ok(ApiUserToken(userToken = userToken))
    }

    override fun deleteUsers(): ResponseEntity<ApiUser> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        cognitoService.deleteAllUsersByUserIdSilently(userId)
        userManagerService.deleteUsers(userId)
        return ResponseEntity.ok(ApiUser(userId,null))
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
    override fun postUsersLikedByWorkdId(workId: String): ResponseEntity<ApiLiked> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val liked = userManagerService.registerUsersLiked(userId, workId)
        val apiLiked = userMapper.toApiLiked(liked)
        return ResponseEntity.ok(apiLiked)
    }

    // レーティング付与
    override fun postUsersRatedByWorkdId(
        @PathVariable workId: String,
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

    // いいね削除
    override fun deleteUsersLikedByWorkdId(workId: String): ResponseEntity<ApiLiked> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val liked = userManagerService.deleteUsersLiked(userId, workId)
        val apiLiked = userMapper.toApiLiked(liked)
        return ResponseEntity.ok(apiLiked)
    }

    // レーティング削除
    override fun deleteUsersRatedByWorkdId(workId: String): ResponseEntity<ApiRated> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val rated = userManagerService.deleteUsersRated(userId, workId)
        val apiRated = userMapper.toApiRated(rated)
        return ResponseEntity.ok(apiRated)
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