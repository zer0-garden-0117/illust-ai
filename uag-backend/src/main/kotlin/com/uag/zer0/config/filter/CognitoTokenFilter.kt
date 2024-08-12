package com.uag.zer0.config.filter

import com.uag.zer0.config.CustomAuthenticationToken
import com.uag.zer0.service.TokenService
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtException
import org.springframework.web.filter.OncePerRequestFilter

class CognitoTokenFilter(
    private val jwtDecoder: JwtDecoder,
    private val tokenService: TokenService,
    private val noBearerTokenPathSet: Set<String>
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: jakarta.servlet.http.HttpServletRequest,
        response: jakarta.servlet.http.HttpServletResponse,
        filterChain: jakarta.servlet.FilterChain
    ) {
        val requestURI = request.requestURI
        if (requestURI in noBearerTokenPathSet) {
            val token = request.getHeader("x-access-token")
            if (token != null) {
                try {
                    val email = tokenService.getEmailFromAccessToken(token)
                    val customAuthentication = CustomAuthenticationToken(
                        email = email
                    )
                    SecurityContextHolder.getContext().authentication =
                        customAuthentication
                } catch (e: JwtException) {
                    SecurityContextHolder.clearContext()
                }
            }
        }
        filterChain.doFilter(request, response)
    }
}