package com.ila.zer0.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.beans.factory.annotation.Value

@Configuration
class CdnConfig(
    @Value("\${cdn.active:false}") private val cdnActive: Boolean,
    @Value("\${cdn.url:https://dev.yourcdn.ne}") private val cdnUrl: String,
) {

    @Bean
    fun cdnActive(): Boolean {
        return cdnActive
    }

    @Bean
    fun cdnUrl(): String {
        return cdnUrl
    }
}