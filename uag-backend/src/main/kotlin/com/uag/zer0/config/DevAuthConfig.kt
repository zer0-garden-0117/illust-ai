package com.uag.zer0.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableWebSecurity
@Profile("dev")
class DevAuthConfig : WebMvcConfigurer {

    @Value("\${cognito.region}")
    private lateinit var cognitoRegion: String

    @Value("\${cognito.pool-id}")
    private lateinit var cognitoPoolId: String

    @Bean
    @kotlin.Throws(Exception::class)
    fun devFilterChain(http: HttpSecurity?): SecurityFilterChain? {
        http
            // 認可設定
            ?.authorizeHttpRequests { authorize ->
                authorize.anyRequest().authenticated()
            }
            // OAuth2 リソースサーバー設定
            ?.oauth2ResourceServer { oauth2 ->
                oauth2.jwt { jwt ->
                    jwt
                        .decoder(JwtDecoders.fromIssuerLocation(cognitoIssuerUrl()))
                }
            }
            // 開発環境ではCSRF保護を無効に設定
            ?.csrf { csrf -> csrf.disable() }
            // セッションレスの設定
            ?.sessionManagement { session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            }
        return http?.build()
    }

    // CORS設定
    @Override
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins(*DEV_FRONT_ORIGINS)
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
            .allowCredentials(true)
    }

    private fun cognitoIssuerUrl(): String {
        return String.format(
            "https://cognito-idp.%s.amazonaws.com/%s",
            cognitoRegion,
            cognitoPoolId
        )
    }

    companion object {
        // CORSのORIGISの設定
        private val DEV_FRONT_ORIGINS: Array<String> = arrayOf(
            "http://localhost:3001", // フロントエンド開発用
            "http://localhost:8000", // SwaggerUI用
        )
    }
}