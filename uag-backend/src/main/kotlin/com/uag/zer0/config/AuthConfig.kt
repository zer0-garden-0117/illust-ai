package com.uag.zer0.config

import com.uag.zer0.config.filter.CognitoTokenFilter
import com.uag.zer0.config.filter.UserTokenFilter
import com.uag.zer0.service.TokenService
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
    private val tokenService: TokenService,
) : WebMvcConfigurer {
    @Value("\${cognito.region}")
    private lateinit var cognitoRegion: String

    @Value("\${cognito.pool-id}")
    private lateinit var cognitoPoolId: String

    @Value("\${security.paths.no-bearer-token}")
    private lateinit var noBearerTokenPathAndMethodString: String

    @Value("\${security.paths.need-access-token}")
    private lateinit var needAccessTokenPathsString: String

    @Value("\${security.paths.csrf-gen}")
    private lateinit var csrfGenPathsString: String

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
                    tokenService,
                    needAccessTokenPathsSet
                ),
                UsernamePasswordAuthenticationFilter::class.java
            )
            // カスタムトークンの検証の設定
            ?.addFilterBefore(
                UserTokenFilter(
                    tokenService,
                    noBearerTokenPathSet
                ),
                UsernamePasswordAuthenticationFilter::class.java
            )
            // CSRFトークンの検証の設定
            //            ?.csrf { csrf ->
            //                csrf
            //                    .csrfTokenRepository(csrfTokenRepository())
            //                    .csrfTokenRequestHandler(SpaCsrfTokenRequestHandler())
            //            }
            //            ?.addFilterAfter(
            //                CsrfTokenGenFilter(
            //                    csrfTokenRepository(),
            //                    csrfGenPathsString, sameSite
            //                ),
            //                CsrfFilter::class.java
            //            )
            ?.csrf {
                it.disable()
            }
        return http?.build()
    }
}