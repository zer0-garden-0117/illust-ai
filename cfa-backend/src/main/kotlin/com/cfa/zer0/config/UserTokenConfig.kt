package com.cfa.zer0.config

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.beans.factory.annotation.Value

@Configuration
class UserTokenConfig(
    @Value("\${userToken.secret:yourRandomSecretKeyBase64Encoded=}") private val userTokenSecret: String,
    @Value("\${userToken.admin-user-id:auth_provider_123456789}") private val adminUserIdString: String,
) {
    private val logger = LoggerFactory.getLogger(UserTokenConfig::class.java)

    @Bean
    fun userTokenSecret(): String {
        return userTokenSecret
    }

    @Bean
    fun adminUserIds(): List<String> {
        val adminUserIds = adminUserIdString.split(",").map { it.trim() }
        logger.info("Loaded adminUserIds: $adminUserIds")
        return adminUserIds
    }
}