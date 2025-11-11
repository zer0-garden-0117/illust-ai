package com.ila.zer0.controller.users

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.generated.endpoint.MyusersApi
import com.ila.zer0.generated.model.ApiIsTag
import com.ila.zer0.generated.model.ApiLiked
import com.ila.zer0.generated.model.ApiTag
import com.ila.zer0.generated.model.ApiUser
import com.ila.zer0.mapper.UserMapper
import com.ila.zer0.service.user.UserManagerService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
class MyUsersController(
    private val userManagerService: UserManagerService,
    private val userMapper: UserMapper,
) : MyusersApi {
    val logger = LoggerFactory.getLogger(UsersController::class.java)

    override fun getMyUser(): ResponseEntity<ApiUser> {
        // 認証ユーザー取得
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // ユーザー取得
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
        // 認証ユーザー取得
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // ユーザーを取得して更新
        val user =
            userManagerService.getUserById(userId) ?: return ResponseEntity(HttpStatus.NOT_FOUND)
        val updatedUser = userManagerService.updateUser(user, coverImage, profileImage, customUserId, userName, userProfile)

        // APIモデルに変換
        val updatedApiUser = userMapper.toApiUser(updatedUser)
        return ResponseEntity.ok(updatedApiUser)
    }

    override fun deleteMyUser(): ResponseEntity<ApiUser> {
        // 認証ユーザー取得
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // ユーザー削除
        userManagerService.deleteUsers(userId)

        return ResponseEntity.ok(ApiUser(userId, null))
    }

    override fun followUsers(
        @PathVariable("userId") userId: String
    ): ResponseEntity<ApiUser> {
        // 認証ユーザー取得
        val myUserId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // フォロー処理
        val user = userManagerService.followUser(myUserId, userId)

        // APIモデルに変換
        val apiUser = userMapper.toApiUser(user)
        return ResponseEntity.ok(apiUser)
    }

    override fun unfollowUsers(
        @PathVariable("userId") userId: String
    ): ResponseEntity<ApiUser> {
        // 認証ユーザー取得
        val myUserId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // フォロー解除処理
        val user = userManagerService.unfollowUser(myUserId, userId)

        // APIモデルに変換
        val apiUser = userMapper.toApiUser(user)
        return ResponseEntity.ok(apiUser)
    }

    // いいね付与
    override fun postUsersLikedByWorkdId(workId: String): ResponseEntity<ApiLiked> {
        // 認証ユーザー取得
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // いいね登録処理
        val liked = userManagerService.registerUsersLiked(userId, workId)

        // APIモデルに変換
        val apiLiked = userMapper.toApiLiked(liked)
        return ResponseEntity.ok(apiLiked)
    }

    // いいね削除
    override fun deleteUsersLikedByWorkdId(workId: String): ResponseEntity<ApiLiked> {
        // 認証ユーザー取得
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // いいね削除処理
        val liked = userManagerService.deleteUsersLiked(userId, workId)

        // APIモデルに変換
        val apiLiked = userMapper.toApiLiked(liked)
        return ResponseEntity.ok(apiLiked)
    }

    // タグが登録されているかを取得
    override fun getUsersTag(
        @PathVariable("tag") tag: String
    ): ResponseEntity<ApiIsTag> {
        // 認証ユーザー取得
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        val isTagged = userManagerService.isUsersTagRegistered(tag, userId)

        val apiIsTag = ApiIsTag(isLiked = isTagged)
        return ResponseEntity.ok(apiIsTag)
    }

    // タグ登録
    override fun postUsersTag(
        @PathVariable("tag") tag: String
    ): ResponseEntity<ApiTag> {
        // 認証ユーザー取得
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // ユーザータグ登録
        val tagged = userManagerService.registerUsersTag(tag, userId)

        val apiTag = ApiTag(tags = mutableListOf(tagged.tag))
        return ResponseEntity.ok(apiTag)
    }

    // タグ削除
    override fun deleteUsersTag(
        @PathVariable("tag") tag: String
    ): ResponseEntity<ApiTag> {
        // 認証ユーザー取得
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // ユーザータグ削除
        val tagged = userManagerService.deleteUsersTag(tag, userId)

        val apiTag = ApiTag(tags = mutableListOf(tagged.tag))
        return ResponseEntity.ok(apiTag)
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