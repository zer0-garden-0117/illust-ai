package com.asb.zer0.config

import com.asb.zer0.config.filter.CognitoTokenFilter
import com.asb.zer0.config.filter.UserTokenFilter
import com.asb.zer0.service.UserTokenService
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
    @Value("\${cognito.region}") private val cognitoRegion: String,
    @Value("\${cognito.pool-id}") private val cognitoPoolId: String,
    @Value("\${security.paths.no-bearer-token}") private val noBearerTokenPathAndMethodString: String,
    @Value("\${security.paths.need-access-token}") private val needAccessTokenPathsString: String
) : WebMvcConfigurer {
    @Bean
    fun cognitoJwtDecoder(): JwtDecoder {
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
        http
            ?.authorizeHttpRequests { authorize ->
                // 認証を免除するパス+メソッドの設定
                noBearerTokenPathAndMethodString.split(",")
                    .forEach { pathWithMethod ->
                        val (path, method) = pathWithMethod.split(":")
                        authorize.requestMatchers(
                            HttpMethod.valueOf(method),
                            path
                        ).permitAll()
                    }
                // それ以外は認証を必要とする設定
                authorize.anyRequest().authenticated()
            }
            // アクセストークンの検証の設定
            ?.addFilterBefore(
                CognitoTokenFilter(
                    cognitoJwtDecoder(),
                    needAccessTokenPathsSet
                ),
                UsernamePasswordAuthenticationFilter::class.java
            )
            // カスタムトークンの検証の設定
            ?.addFilterBefore(
                UserTokenFilter(
                    userTokenService,
                    noBearerTokenPathSet
                ),
                UsernamePasswordAuthenticationFilter::class.java
            )
            ?.csrf {
                it.disable()
            }
        return http?.build()
    }
}