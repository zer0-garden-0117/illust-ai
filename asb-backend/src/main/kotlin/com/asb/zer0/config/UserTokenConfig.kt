package com.asb.zer0.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.beans.factory.annotation.Value

@Configuration
class UserTokenConfig(
    @Value("\${userToken.secret:yourRandomSecretKeyBase64Encoded=}") private val userTokenSecret: String,
    @Value("\${userToken.admin-user-ids:auth_provider_123456789}") private val adminUserIds: List<String>,
) {

    @Bean
    fun userTokenSecret(): String {
        return userTokenSecret
    }

    @Bean
    fun adminUserIds(): List<String> {
        return adminUserIds
    }
}