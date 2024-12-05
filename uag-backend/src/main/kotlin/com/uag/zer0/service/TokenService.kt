package com.uag.zer0.service

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import org.slf4j.LoggerFactory
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder
import java.util.*

@Service
class TokenService {
    private val logger = LoggerFactory.getLogger(TokenService::class.java)

    private val secretKey: String = "mysecretekey"
    private val algorithm = Algorithm.HMAC256(secretKey)
    private val adminUserId = ""

    fun getEmailFromAccessToken(accessToken: String): String? {
        val restTemplate = RestTemplate()
        val url =
            UriComponentsBuilder.fromHttpUrl("https://angels-graffiti.auth.us-east-1.amazoncognito.com")
                .path("/oauth2/userInfo")
                .build()
                .toUri()

        val headers = HttpHeaders().apply {
            set("Authorization", "Bearer $accessToken")
        }

        val requestEntity = HttpEntity<Any>(headers)
        val responseType =
            object : ParameterizedTypeReference<Map<String, Any>>() {}
        val response: ResponseEntity<Map<String, Any>> = restTemplate.exchange(
            url,
            HttpMethod.GET,
            requestEntity,
            responseType
        )

        val userInfo = response.body
        return userInfo?.get("email") as String?
    }

    fun generateToken(userId: String): String {
        val userRole = if (userId == adminUserId)
            "admin" else "user"
        val token = JWT.create()
            .withClaim("role", userRole)
            .withClaim("userId", userId)
            .withExpiresAt(Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
            .sign(algorithm)
        return token
    }

    fun validateAndGetMemberId(token: String): String {
        try {
            val algorithm = Algorithm.HMAC256(secretKey)
            val verifier = JWT.require(algorithm).build()
            val decodedJWT = verifier.verify(token)
            val userId = decodedJWT.getClaim("userId").asString()
            return userId
        } catch (exception: JWTVerificationException) {
            throw IllegalArgumentException("Invalid token")
        }
    }

    fun getRoleFromToken(token: String): String {
        try {
            val algorithm = Algorithm.HMAC256(secretKey)
            val verifier = JWT.require(algorithm).build()
            val decodedJWT = verifier.verify(token)
            return decodedJWT.getClaim("role").asString()
        } catch (exception: JWTVerificationException) {
            throw IllegalArgumentException("Invalid token")
        }
    }
}