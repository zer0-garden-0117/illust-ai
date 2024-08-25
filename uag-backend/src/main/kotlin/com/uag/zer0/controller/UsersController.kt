package com.uag.zer0.controller

import com.uag.zer0.config.CustomAuthenticationToken
import com.uag.zer0.entity.user.User
import com.uag.zer0.generated.endpoint.UsersApi
import com.uag.zer0.generated.model.ApiUserToken
import com.uag.zer0.service.TokenService
import com.uag.zer0.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.RestController

@RestController
class UsersController(
    private val tokenService: TokenService,
    private val userService: UserService
) : UsersApi {

    override fun getUsersToken(): ResponseEntity<ApiUserToken> {
        val authentication: Authentication? =
            SecurityContextHolder.getContext().authentication
        val customAuth = authentication as? CustomAuthenticationToken
        val email = customAuth?.email ?: return ResponseEntity.ok(
            ApiUserToken(userToken = "unregistered")
        )
        val currentUser: User =
            userService.hasUser(email) ?: userService.registerUser(email)
        val userToken = tokenService.generateToken(currentUser)
        return ResponseEntity.ok(ApiUserToken(userToken = userToken))
    }
}