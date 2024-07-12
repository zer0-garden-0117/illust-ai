package com.uag.zer0.config

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.security.web.csrf.CsrfFilter
import org.springframework.security.web.csrf.CsrfToken
import org.springframework.security.web.csrf.CsrfTokenRepository
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.security.web.util.matcher.OrRequestMatcher
import org.springframework.security.web.util.matcher.RequestMatcher
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.io.IOException

@Configuration
@EnableWebSecurity
@Profile("prod")
class ProdAuthConfig : WebMvcConfigurer {
    @Value("\${cognito.region}")
    private lateinit var cognitoRegion: String

    @Value("\${cognito.pool-id}")
    private lateinit var cognitoPoolId: String

    @Bean
    @kotlin.Throws(Exception::class)
    fun prodFilterChain(http: HttpSecurity?): SecurityFilterChain? {
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
            // CSRF対策にDouble Submit Cookieパターンを使用
            ?.csrf { csrf ->
                csrf
                    .csrfTokenRepository(csrfTokenRepository)
                    .requireCsrfProtectionMatcher(csrfGenMatcher)
            }
            // CSRFトークンを生成するフィルターを追加
            ?.addFilterAfter(
                CsrfTokenGeneratorFilter(csrfTokenRepository),
                CsrfFilter::class.java
            )
        return http?.build()
    }

    // CSRFトークンを生成するフィルター
    private class CsrfTokenGeneratorFilter(private val csrfTokenRepository: CsrfTokenRepository) :
        OncePerRequestFilter() {
        @Override
        @kotlin.Throws(ServletException::class, IOException::class)
        override fun doFilterInternal(
            request: HttpServletRequest,
            response: HttpServletResponse,
            filterChain: FilterChain
        ) {
            val csrfToken: CsrfToken =
                csrfTokenRepository.generateToken(request)
            csrfTokenRepository.saveToken(csrfToken, request, response)
            if (response.containsHeader("Set-Cookie")) {
                val cookie: String =
                    response.getHeader("Set-Cookie") + "; SameSite=Strict; Secure"
                response.setHeader("Set-Cookie", cookie)
            }
            request.setAttribute(CsrfToken::class.java.name, csrfToken)
            request.setAttribute(csrfToken.parameterName, csrfToken.token)
            filterChain.doFilter(request, response)
        }
    }

    // CORS設定
    @Override
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins(*PROD_FRONT_ORIGINS)
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
        // CORSのORIGINSの設定
        private val PROD_FRONT_ORIGINS: Array<String> = arrayOf(
            "http://localhost:3001", // フロントエンド開発用
            "http://localhost:8000", // SwaggerUI用
        )

        // CSRFトークンを生成するエンドポイントを指定
        private val csrfGenMatcher: RequestMatcher = OrRequestMatcher(
            AntPathRequestMatcher("/users/me")
        )
        private val csrfTokenRepository: CookieCsrfTokenRepository =
            CookieCsrfTokenRepository.withHttpOnlyFalse()
    }
}