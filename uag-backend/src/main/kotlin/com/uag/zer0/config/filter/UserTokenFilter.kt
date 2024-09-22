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
        if (isPathExempted(request)) {
            filterChain.doFilter(request, response)
            return
        }

        val token = resolveToken(request)
        if (token != null) {
            try {
                val userId = tokenService.validateAndGetMemberId(token)
                val role = tokenService.getRoleFromToken(token)
                val customAuthentication = CustomAuthenticationToken(
                    userId = userId,
                    role = role,
                )
                SecurityContextHolder.getContext().authentication =
                    customAuthentication
                logger.info(customAuthentication)
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

    private fun isPathExempted(request: jakarta.servlet.http.HttpServletRequest): Boolean {
        val requestURI = request.requestURI
        val requestMethod = request.method
        val pathWithMethod = "$requestURI:$requestMethod"

        logger.info("Request: $pathWithMethod")

        // 完全一致のパスの場合
        if (pathWithMethod in noBearerTokenPathSet) {
            return true
        }

        // ワイルドカードを含むパスの場合
        return noBearerTokenPathSet.any { exemptedPath ->
            val (exemptedUri, exemptedMethod) = exemptedPath.split(":")
            val pathPattern = exemptedUri.replace("*", ".*") // ワイルドカードを正規表現に変換
            pathWithMethod.matches(Regex("$pathPattern:$exemptedMethod"))
        }
    }
}