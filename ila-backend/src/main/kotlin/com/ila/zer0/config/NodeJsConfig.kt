package com.ila.zer0.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.beans.factory.annotation.Value

@Configuration
class NodeJsConfig(
    @Value("\${nodeJs.path:/Users/{username}/angel-sandbox/node-scripts}") private val nodeJsPath: String,
) {

    @Bean
    fun nodeJsPath(): String {
        return nodeJsPath
    }
}