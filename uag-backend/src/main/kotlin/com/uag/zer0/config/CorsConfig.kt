package com.uag.zer0.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableWebSecurity
@Profile("prod", "dev", "test")
class CorsConfig : WebMvcConfigurer {

    @Value("\${cors.origins}")
    private lateinit var corsOriginsString: String
    private val corsOrigins: Array<String>
        get() = corsOriginsString.split(",").toTypedArray()

    @Override
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins(*corsOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
            .allowCredentials(true)
    }
}