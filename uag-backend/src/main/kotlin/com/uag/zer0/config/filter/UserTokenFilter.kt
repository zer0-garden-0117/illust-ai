package com.uag.zer0.config.filter

import com.uag.zer0.config.CustomAuthenticationToken
import com.uag.zer0.service.TokenService
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.OncePerRequestFilter

class UserTokenFilter(
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
            filterChain.doFilter(request, response)
            return
        }

        val token = resolveToken(request)
        if (token != null) {
            try {
                val memberId = tokenService.validateAndGetMemberId(token)
                val role = tokenService.getRoleFromToken(token)
                val currentAuthentication =
                    SecurityContextHolder.getContext().authentication as? CustomAuthenticationToken
                val customAuthentication = CustomAuthenticationToken(
                    email = currentAuthentication?.email,
                    memberId = memberId,
                    role = role,
                )
                SecurityContextHolder.getContext().authentication =
                    customAuthentication
            } catch (e: Exception) {
                logger.error("Invalid token", e)
            }
        }
        filterChain.doFilter(request, response)
    }

    private fun resolveToken(request: jakarta.servlet.http.HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")
        return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            bearerToken.substring(7)
                .also { logger.info("Bearer token extracted") }
        } else {
            logger.info("No Bearer token found in Authorization header")
            null
        }
    }
}