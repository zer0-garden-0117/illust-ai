package com.uag.zer0.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder

@Configuration
class AccessTokenConfig {

    @Bean
    fun jwtDecoder(): JwtDecoder {
        // CognitoのJWKセットURI (ユーザープールに基づいたもの)
        val jwkSetUri =
            "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_87sFPpVTk/.well-known/jwks.json"
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build()
    }
}