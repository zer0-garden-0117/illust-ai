package com.ila.zer0.service

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserTokenService(
    private val userTokenSecret: String,
    @Qualifier("adminUserIds") private val adminUserIds: List<String>  // Qualifierで指定
) {
    private val logger = LoggerFactory.getLogger(UserTokenService::class.java)

    private val algorithm = Algorithm.HMAC256(userTokenSecret)

    fun generateToken(userId: String): String {
        logger.info(userId)
        logger.info("Admin user IDs: $adminUserIds")  // デバッグレベルに変更
        val userRole = if (adminUserIds.contains(userId))
            "admin" else "user"
        val token = JWT.create()
            .withClaim("role", userRole)
            .withClaim("userId", userId)
            .withExpiresAt(Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
            .sign(algorithm)
        logger.info(token)
        return token
    }

    fun validateAndGetMemberId(token: String): String {
        try {
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
            val verifier = JWT.require(algorithm).build()
            val decodedJWT = verifier.verify(token)
            return decodedJWT.getClaim("role").asString()
        } catch (exception: JWTVerificationException) {
            throw IllegalArgumentException("Invalid token")
        }
    }
}