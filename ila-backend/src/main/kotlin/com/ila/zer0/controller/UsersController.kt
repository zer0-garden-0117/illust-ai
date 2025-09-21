package com.ila.zer0.controller

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.dto.UsersActivity
import com.ila.zer0.generated.endpoint.UsersApi
import com.ila.zer0.generated.model.*
import com.ila.zer0.mapper.UserMapper
import com.ila.zer0.mapper.WorkMapper
import com.ila.zer0.service.user.UserManagerService
import io.swagger.v3.oas.annotations.Parameter
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
        val newUser = userManagerService.registerUser(userId)
        return ResponseEntity.ok(userMapper.toApiUser(newUser))
    }

    override fun patchMyUser(
        @RequestPart("coverImage", required = true) coverImage: MultipartFile,
        @RequestPart("profileImage", required = true) profileImage: MultipartFile,
        @RequestParam(value = "customUserId", required = true) customUserId: String,
        @RequestParam(value = "userProfile", required = true) userProfile: String
    ): ResponseEntity<ApiUser> {
        logger.info("patchMyUser")
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val user =
            userManagerService.getUserById(userId) ?: return ResponseEntity(HttpStatus.NOT_FOUND)
        val updatedUser = userManagerService.updateUser(user, coverImage, profileImage, customUserId, userProfile)
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
            totalCount = likedResult.totalCount
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