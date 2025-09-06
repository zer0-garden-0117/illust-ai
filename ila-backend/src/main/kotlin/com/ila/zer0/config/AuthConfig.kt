package com.ila.zer0.config

import com.ila.zer0.config.filter.FirebaseAuthFilter
import com.google.firebase.auth.FirebaseAuth
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableWebSecurity
@Profile("prod", "dev", "test")
class AuthConfig(
    private val firebaseAuth: FirebaseAuth,
    @Value("\${security.paths.no-bearer-token}") private val noBearerTokenPathAndMethodString: String,
) : WebMvcConfigurer {
    @Bean
    @kotlin.Throws(Exception::class)
    fun filterChain(http: HttpSecurity?): SecurityFilterChain? {
        val noBearerTokenPathSet = noBearerTokenPathAndMethodString.split(",")
            .map { it.trim() }.toSet()
        http
            ?.csrf { it.disable() }
            ?.authorizeHttpRequests { authorize ->
                authorize
                    .anyRequest().permitAll()
            }
            ?.addFilterBefore(
                FirebaseAuthFilter(
                    firebaseAuth,
                    noBearerTokenPathSet
                ),
                UsernamePasswordAuthenticationFilter::class.java
            )
        return http?.build()
    }
}