package com.ila.zer0.controller.users

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.generated.endpoint.MyusersApi
import com.ila.zer0.generated.model.ApiUser
import com.ila.zer0.mapper.UserMapper
import com.ila.zer0.service.user.UserManagerService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
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
        return ResponseEntity.ok(ApiUser(userId, null))
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