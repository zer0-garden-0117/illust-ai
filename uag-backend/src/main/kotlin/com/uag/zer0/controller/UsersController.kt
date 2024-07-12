package com.uag.zer0.controller

import com.uag.zer0.generated.endpoint.UsersApi
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController

@RestController
class UsersController : UsersApi {

    override fun getUsersMe(
        @RequestHeader(
            value = "authorization",
            required = true
        ) authorization: String
    ): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.OK)
    }
}