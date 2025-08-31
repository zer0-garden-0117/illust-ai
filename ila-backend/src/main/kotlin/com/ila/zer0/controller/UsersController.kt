package com.ila.zer0.controller

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.dto.UsersActivity
import com.ila.zer0.generated.endpoint.UsersApi
import com.ila.zer0.generated.model.*
import com.ila.zer0.mapper.UserMapper
import com.ila.zer0.mapper.WorkMapper
import com.ila.zer0.service.CognitoService
import com.ila.zer0.service.user.UserManagerService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class UsersController(
    private val userManagerService: UserManagerService,
    private val cognitoService: CognitoService,
    private val userMapper: UserMapper,
    private val workMapper: WorkMapper
) : UsersApi {
    override fun registerUsers(
        @RequestBody apiUser: ApiUser
    ): ResponseEntity<ApiUser> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val newUser = userMapper.toUser(apiUser)
        newUser.userId = userId
        val registeredUser = userManagerService.registerUser(newUser)
        val registeredApiUser = userMapper.toApiUser(registeredUser)
        return ResponseEntity.ok(registeredApiUser)
    }

    override fun getUsers(): ResponseEntity<ApiUser> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val user = userManagerService.getUser(userId)
        val apiUser = userMapper.toApiUser(user)
        return ResponseEntity.ok(apiUser)
    }

    override fun patchUsers(
        @RequestBody apiUser: ApiUser
    ): ResponseEntity<ApiUser> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val newUser = userMapper.toUser(apiUser)
        val user = userManagerService.getUser(userId)
        user.userProfile = newUser.userProfile
        user.customUserId = newUser.customUserId
        val updatedUser = userManagerService.updateUser(user)
        val updatedApiUser = userMapper.toApiUser(updatedUser)
        return ResponseEntity.ok(updatedApiUser)
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

    // いいね削除
    override fun deleteUsersLikedByWorkdId(workId: String): ResponseEntity<ApiLiked> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val liked = userManagerService.deleteUsersLiked(userId, workId)
        val apiLiked = userMapper.toApiLiked(liked)
        return ResponseEntity.ok(apiLiked)
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

    fun toApiUsersActivity(activityList: UsersActivity): ApiUsersActivity {
        val apiLiked = mutableListOf<ApiLiked>()
        activityList.liked.forEach { liked ->
            apiLiked.add(userMapper.toApiLiked(liked))
        }
        return ApiUsersActivity(
            apiLikeds = apiLiked
        )
    }

    private fun getUserId(): String? {
        val authentication: Authentication? =
            SecurityContextHolder.getContext().authentication
        val customAuth = authentication as? CustomAuthenticationToken
        return customAuth?.userId
    }
}