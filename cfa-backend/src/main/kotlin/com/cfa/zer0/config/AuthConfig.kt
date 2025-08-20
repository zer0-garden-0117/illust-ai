package com.cfa.zer0.config

import com.cfa.zer0.config.filter.AdminAPIFilter
import com.cfa.zer0.config.filter.CognitoTokenFilter
import com.cfa.zer0.config.filter.UserTokenFilter
import com.cfa.zer0.service.AdminAuthService
import com.cfa.zer0.service.UserTokenService
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableWebSecurity
@Profile("prod", "dev", "test")
class AuthConfig(
    private val userTokenService: UserTokenService,
    private val adminAuthService: AdminAuthService,
    @Value("\${cognito.region:us-east-1}") private val cognitoRegion: String,
    @Value("\${cognito.pool-id:us-east-1_xxxxxxxxx}") private val cognitoPoolId: String,
    @Value("\${security.paths.no-bearer-token}") private val noBearerTokenPathAndMethodString: String,
    @Value("\${security.paths.need-access-token}") private val needAccessTokenPathsString: String,
    @Value("\${security.paths.admin-api}") private val adminApiPathString: String,
) : WebMvcConfigurer {
    @Bean
    fun cognitoJwtDecoder(): JwtDecoder? {
        // デフォルト値の場合はnullを返す
        if (cognitoPoolId == "us-east-1_xxxxxxxxx") {
            return null
        }

        val issuerUrl = String.format(
            "https://cognito-idp.%s.amazonaws.com/%s",
            cognitoRegion, cognitoPoolId
        )
        return JwtDecoders.fromIssuerLocation(issuerUrl)
    }

    @Bean
    fun csrfTokenRepository(): CookieCsrfTokenRepository {
        return CookieCsrfTokenRepository.withHttpOnlyFalse()
    }

    @Bean
    @kotlin.Throws(Exception::class)
    fun filterChain(http: HttpSecurity?): SecurityFilterChain? {
        val noBearerTokenPathSet = noBearerTokenPathAndMethodString.split(",")
            .map { it.trim() }.toSet()
        val needAccessTokenPathsSet = needAccessTokenPathsString.split(",")
            .map { it.trim() }.toSet()
        val adminApiPathSet = adminApiPathString.split(",")
            .map { it.trim() }.toSet()
        http
            ?.authorizeHttpRequests { authorize ->
                // 認証を免除するパス+メソッドの設定
                authorize.anyRequest().permitAll() // すべて許可
            }
//            // アクセストークンの検証の設定
//            ?.addFilterBefore(
//                CognitoTokenFilter(
//                    cognitoJwtDecoder(),
//                    needAccessTokenPathsSet
//                ),
//                UsernamePasswordAuthenticationFilter::class.java
//            )
//            // カスタムトークンの検証の設定
//            ?.addFilterBefore(
//                UserTokenFilter(
//                    userTokenService,
//                    noBearerTokenPathSet
//                ),
//                UsernamePasswordAuthenticationFilter::class.java
//            )
//            // 管理用APIの検証の設定
//            ?.addFilterBefore(
//                AdminAPIFilter(
//                    adminAuthService,
//                    adminApiPathSet
//                ),
//                UsernamePasswordAuthenticationFilter::class.java
//            )
            ?.csrf {
                it.disable()
            }
            ?.cors { it.disable() }
        return http?.build()
    }
}