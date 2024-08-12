package com.uag.zer0.config

import com.uag.zer0.config.filter.CognitoTokenFilter
import com.uag.zer0.config.filter.CsrfTokenGenFilter
import com.uag.zer0.config.filter.UserTokenFilter
import com.uag.zer0.config.handler.SpaCsrfTokenRequestHandler
import com.uag.zer0.service.TokenService
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.security.web.csrf.CsrfFilter
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableWebSecurity
@Profile("prod", "dev")
class AuthConfig(
    private val tokenService: TokenService,
) : WebMvcConfigurer {
    @Value("\${cognito.region}")
    private lateinit var cognitoRegion: String

    @Value("\${cognito.pool-id}")
    private lateinit var cognitoPoolId: String

    @Value("\${security.paths.csrf-gen}")
    private lateinit var csrfGenPathsString: String

    @Value("\${security.paths.no-bearer-token}")
    private lateinit var noBearerTokenPaths: String

    @Value("\${security.csrf.same-site}")
    private lateinit var sameSite: String

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
        val noBearerTokenPathSet = noBearerTokenPaths.split(",")
            .map { it.trim() }.toSet()
        http
            // 認可設定
            ?.authorizeHttpRequests { authorize ->
                authorize
                    .requestMatchers(
                        *noBearerTokenPaths.split(",").toTypedArray()
                    ).permitAll()
                    .anyRequest().authenticated()
            }
            // アクセストークンの検証の設定
            ?.addFilterBefore(
                CognitoTokenFilter(
                    cognitoJwtDecoder(),
                    tokenService,
                    noBearerTokenPathSet
                ),
                UsernamePasswordAuthenticationFilter::class.java
            )
            // カスタムトークンの検証の設定
            ?.addFilterBefore(
                UserTokenFilter(tokenService, noBearerTokenPathSet),
                UsernamePasswordAuthenticationFilter::class.java
            )
            // CSRFトークンの検証の設定
            ?.csrf { csrf ->
                csrf
                    .csrfTokenRepository(csrfTokenRepository())
                    .csrfTokenRequestHandler(SpaCsrfTokenRequestHandler())
            }
            ?.addFilterAfter(
                CsrfTokenGenFilter(
                    csrfTokenRepository(),
                    csrfGenPathsString, sameSite
                ),
                CsrfFilter::class.java
            )
        return http?.build()
    }
}