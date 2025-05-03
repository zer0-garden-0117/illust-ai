package com.asb.zer0.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.beans.factory.annotation.Value

@Configuration
class NodeJsConfig(
    @Value("\${nodeJs.path}") private val nodeJsPath: String,
) {

    @Bean
    fun nodeJsPath(): String {
        return nodeJsPath
    }
}