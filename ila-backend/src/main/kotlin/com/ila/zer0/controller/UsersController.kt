package com.ila.zer0.controller

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.dto.UsersActivity
import com.ila.zer0.generated.endpoint.UsersApi
import com.ila.zer0.generated.model.*
import com.ila.zer0.mapper.UserMapper
import com.ila.zer0.mapper.WorkMapper
import com.ila.zer0.service.user.UserManagerService
import com.ila.zer0.service.work.WorkManagerService
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.Valid
import jakarta.validation.constraints.NotNull
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
class UsersController(
    private val userManagerService: UserManagerService,
    private val workManagerService: WorkManagerService,
    private val userMapper: UserMapper,
    private val workMapper: WorkMapper
) : UsersApi {
    val logger = LoggerFactory.getLogger(UsersController::class.java)

    override fun getMyUser(): ResponseEntity<ApiUser> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val registeredUser = userManagerService.getUserById(userId)
        // 登録済の場合
        if (registeredUser != null) {
            return ResponseEntity.ok(userMapper.toApiUser(registeredUser))
        }
        // 未登録の場合(初回ログイン時)
        val userName =
            getUserName() ?: "Your Name"
        val newUser = userManagerService.registerUser(userId, userName)
        return ResponseEntity.ok(userMapper.toApiUser(newUser))
    }

    override fun patchMyUser(
        @RequestPart("coverImage", required = true) coverImage: MultipartFile,
        @RequestPart("profileImage", required = true) profileImage: MultipartFile,
        @RequestParam(value = "customUserId", required = true) customUserId: String,
        @RequestParam(value = "userName", required = true) userName: String,
        @RequestParam(value = "userProfile", required = true) userProfile: String
    ): ResponseEntity<ApiUser> {
        logger.info("patchMyUser")
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val user =
            userManagerService.getUserById(userId) ?: return ResponseEntity(HttpStatus.NOT_FOUND)
        val updatedUser = userManagerService.updateUser(user, coverImage, profileImage, customUserId, userName, userProfile)
        val updatedApiUser = userMapper.toApiUser(updatedUser)
        return ResponseEntity.ok(updatedApiUser)
    }

    override fun deleteMyUser(): ResponseEntity<ApiUser> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        userManagerService.deleteUsers(userId)
        return ResponseEntity.ok(ApiUser(userId,null))
    }

    override fun getUsers(
        @PathVariable("customUserId") customUserId: String
    ): ResponseEntity<ApiUser> {
        logger.info("getUsers")
        val callerUserId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val user = userManagerService.getUserByCustomUserId(customUserId, callerUserId) ?:
            return ResponseEntity.notFound().build()
        val apiUser = userMapper.toApiUser(user)
        return ResponseEntity.ok(apiUser)
    }

    @CrossOrigin(exposedHeaders = ["X-User-Available"])
    override fun checkUserAvailability(
        @PathVariable("customUserId") customUserId: String
    ): ResponseEntity<Unit> {
        logger.info("checkUserAvailability")
        return if (userManagerService.findUserByCustomUserId(customUserId) == null) {
            // 存在しない場合
            ResponseEntity.ok()
                .header("X-User-Available", "true")
                .build()
        } else {
            // 存在する場合
            ResponseEntity.ok()
                .header("X-User-Available", "false")
                .build()
        }
    }

    override fun getUsersWorks(
        @PathVariable("customUserId") customUserId: String,
        @RequestParam(value = "offset", required = true) offset: Int,
        @RequestParam(value = "limit", required = true) limit: Int,
        @RequestParam(value = "userWorksFilterType", required = true) userWorksFilterType: String
    ): ResponseEntity<ApiWorks> {
        // 認証ユーザーを取得
        val myUserId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        val usersWorks = workManagerService.getUsersWorksByCustomUserIdWithFilter(
            myUserId, customUserId, offset, limit, userWorksFilterType)
            ?: return ResponseEntity.notFound().build()

        // APIモデルに変換
        val apiWorkWithTags = mutableListOf<ApiWorkWithTag>()
        usersWorks.works.forEach { work ->
            val apiWork = workMapper.toApiWork(work)
            val apiWorkWithTag = ApiWorkWithTag(apiWork = apiWork, apiTags = null)
            apiWorkWithTags.add(apiWorkWithTag)
        }
        val apiWorks = ApiWorks(apiWorkWithTags, usersWorks.totalCount)
        return ResponseEntity.ok(apiWorks)
    }

    override fun followUsers(
        @PathVariable("userId") userId: String
    ): ResponseEntity<ApiUser> {
        val myUserId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val user = userManagerService.followUser(myUserId, userId)
        val apiUser = userMapper.toApiUser(user)
        return ResponseEntity.ok(apiUser)
    }

    override fun unfollowUsers(
        @PathVariable("userId") userId: String
    ): ResponseEntity<ApiUser> {
        val myUserId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val user = userManagerService.unfollowUser(myUserId, userId)
        val apiUser = userMapper.toApiUser(user)
        return ResponseEntity.ok(apiUser)
    }

    override fun getFollowUsers(
        @PathVariable("customUserId") customUserId: String,
        @RequestParam(value = "offset", required = true) offset: Int,
        @RequestParam(value = "limit", required = true) limit: Int,
        @RequestParam(value = "followType", required = true) followType: String
    ): ResponseEntity<ApiFollowUsers> {
        logger.info("getFollowUsers")
        logger.info("customUserId: $customUserId, offset: $offset, limit: $limit, followType: $followType")
        val myUserId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val followUsersResult =
            userManagerService.getFollowUsersByCustomUserId(customUserId, offset, limit, followType,myUserId)
                ?: return ResponseEntity.notFound().build()

        // APIモデルに変換
        val apiUsers = mutableListOf<ApiUser>()
        followUsersResult.users.forEach { user ->
            val apiUser = userMapper.toApiUser(user)
            apiUsers.add(apiUser)
        }
        val apiFollowsUsers = ApiFollowUsers(apiUsers, followUsersResult.totalCount)
        return ResponseEntity.ok(apiFollowsUsers)
    }

    override fun getFollowerUsers(
        @PathVariable("customUserId") customUserId: String,
        @RequestParam(value = "offset", required = true) offset: Int,
        @RequestParam(value = "limit", required = true) limit: Int
    ): ResponseEntity<ApiFollowUsers> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
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

    private fun getUserId(): String? {
        val authentication: Authentication? =
            SecurityContextHolder.getContext().authentication
        val customAuth = authentication as? CustomAuthenticationToken
        return customAuth?.userId
    }

    private fun getUserName(): String? {
        val authentication: Authentication? =
            SecurityContextHolder.getContext().authentication
        val customAuth = authentication as? CustomAuthenticationToken
        return customAuth?.userName
    }
}