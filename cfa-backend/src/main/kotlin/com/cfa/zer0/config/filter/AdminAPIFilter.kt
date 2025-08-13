package com.cfa.zer0.config.filter

import com.cfa.zer0.service.AdminAuthService
import org.springframework.web.filter.OncePerRequestFilter

class AdminAPIFilter(
    private val adminAuthService: AdminAuthService,
    private val adminApiPathSet: Set<String>
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
        val key = resolveInternalKey(request)
        adminAuthService.validateInternalKey(key)
        filterChain.doFilter(request, response)
    }

    private fun resolveInternalKey(request: jakarta.servlet.http.HttpServletRequest): String? {
        return request.getHeader("Authorization")
    }

    private fun isPathExempted(request: jakarta.servlet.http.HttpServletRequest): Boolean {
        val requestURI = request.requestURI
        val requestMethod = request.method
        val pathWithMethod = "$requestURI:$requestMethod"

        logger.info("Request: $pathWithMethod")

        // 一致する場合は免除しないためfalse
        return pathWithMethod !in adminApiPathSet
    }
}