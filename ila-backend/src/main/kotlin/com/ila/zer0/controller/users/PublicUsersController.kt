package com.ila.zer0.controller.users

import com.ila.zer0.generated.endpoint.PublicusersApi
import com.ila.zer0.generated.model.ApiFollowUsers
import com.ila.zer0.generated.model.ApiTaggeds
import com.ila.zer0.generated.model.ApiUser
import com.ila.zer0.mapper.UserMapper
import com.ila.zer0.service.user.UserManagerService
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class PublicUsersController(
    private val userManagerService: UserManagerService,
    private val userMapper: UserMapper,
) : PublicusersApi {
    val logger = LoggerFactory.getLogger(UsersController::class.java)

    override fun getPublicUsers(
        @PathVariable("customUserId") customUserId: String
    ): ResponseEntity<ApiUser> {
        // 指定されたcustomUserIdのユーザーを取得
        val user = userManagerService.getUserByCustomUserId(customUserId) ?:
            return ResponseEntity.notFound().build()

        // APIモデルに変換
        val apiUser = userMapper.toApiUser(user)
        return ResponseEntity.ok(apiUser)
    }

    override fun getPublicFollowUsers(
        @PathVariable("customUserId") customUserId: String,
        @RequestParam(value = "offset", required = true) offset: Int,
        @RequestParam(value = "limit", required = true) limit: Int,
        @RequestParam(value = "followType", required = true) followType: String
    ): ResponseEntity<ApiFollowUsers> {
        // フォロー一覧を取得
        val followUsersResult =
            userManagerService.getFollowUsersByCustomUserId(customUserId, offset, limit, followType)
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

    override fun getPublicTagUsers(
        @PathVariable("customUserId") customUserId: String,
        @RequestParam(value = "offset", required = true) offset: Int,
        @RequestParam(value = "limit", required = true) limit: Int
    ): ResponseEntity<ApiTaggeds> {
        // ユーザーの登録タグ一覧を取得
        val usersTagsResult =
            userManagerService.getUsersTagsWithOffset(customUserId, offset, limit)
                ?: return ResponseEntity.notFound().build()

        // APIモデルに変換
        val tags = mutableListOf<String>()
        usersTagsResult.taggeds.map { tagged ->
            tags.add(tagged.tag)
        }
        val apiTagUsers = ApiTaggeds(
            tags = tags,
            totalTagCount = usersTagsResult.totalCount
        )
        return ResponseEntity.ok(apiTagUsers)
    }
}