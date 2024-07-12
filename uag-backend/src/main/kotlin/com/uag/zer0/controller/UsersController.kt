package com.uag.zer0.controller

import com.uag.zer0.generated.endpoint.UsersApi
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController

@RestController
class UsersController : UsersApi {

    private val logger: Logger =
        LoggerFactory.getLogger(UsersController::class.java)
    
    override fun getUsersMe(
        @RequestHeader(
            value = "authorization",
            required = true
        ) authorization: String
    ): ResponseEntity<Unit> {
        logger.info("getUsersMe called with authorization: $authorization")
        return ResponseEntity(HttpStatus.OK)
    }
}