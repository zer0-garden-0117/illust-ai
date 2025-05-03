package com.asb.zer0.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.beans.factory.annotation.Value

@Configuration
class UserTokenConfig(
    @Value("\${userToken.secret}") private val userTokenSecret: String,
    @Value("\${userToken.admin-user-id}") private val adminUserId: String,
) {

    @Bean
    fun userTokenSecret(): String {
        return userTokenSecret
    }

    @Bean
    fun adminUserId(): String {
        return adminUserId
    }
}