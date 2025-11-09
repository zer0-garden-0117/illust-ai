package com.ila.zer0.controller.users

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.generated.endpoint.UsersApi
import com.ila.zer0.generated.model.ApiFollowUsers
import com.ila.zer0.generated.model.ApiUser
import com.ila.zer0.mapper.UserMapper
import com.ila.zer0.service.user.UserManagerService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class UsersController(
    private val userManagerService: UserManagerService,
    private val userMapper: UserMapper,
) : UsersApi {
    val logger = LoggerFactory.getLogger(UsersController::class.java)

    override fun getUsers(
        @PathVariable("customUserId") customUserId: String
    ): ResponseEntity<ApiUser> {
        // 認証ユーザーを取得
        val callerUserId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // 指定されたcustomUserIdのユーザーを取得
        val user = userManagerService.getUserByCustomUserId(customUserId, callerUserId) ?:
            return ResponseEntity.notFound().build()

        // APIモデルに変換
        val apiUser = userMapper.toApiUser(user)
        return ResponseEntity.ok(apiUser)
    }

    override fun getFollowUsers(
        @PathVariable("customUserId") customUserId: String,
        @RequestParam(value = "offset", required = true) offset: Int,
        @RequestParam(value = "limit", required = true) limit: Int,
        @RequestParam(value = "followType", required = true) followType: String
    ): ResponseEntity<ApiFollowUsers> {
        // 認証ユーザーを取得
        val myUserId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // フォロー一覧を取得
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

    @CrossOrigin(exposedHeaders = ["X-User-Available"])
    override fun checkUserAvailability(
        @PathVariable("customUserId") customUserId: String
    ): ResponseEntity<Unit> {
        // 認証ユーザーを取得
        getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // ユーザーの存在確認
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

    private fun getUserId(): String? {
        val authentication: Authentication? =
            SecurityContextHolder.getContext().authentication
        val customAuth = authentication as? CustomAuthenticationToken
        return customAuth?.userId
    }
}