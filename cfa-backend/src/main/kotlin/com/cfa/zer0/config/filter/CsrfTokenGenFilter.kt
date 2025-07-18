package com.cfa.zer0.config.filter

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.web.csrf.CsrfToken
import org.springframework.security.web.csrf.CsrfTokenRepository
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException

class CsrfTokenGenFilter(
    private val csrfTokenRepository: CsrfTokenRepository,
    private val csrfTokenGenPath: String,
    private val sameSite: String
) : OncePerRequestFilter() {

    @Override
    @kotlin.Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val exemptMethods = setOf("HEAD", "OPTIONS", "TRACE", "GET")
        if (exemptMethods.contains(request.method.uppercase()) &&
            request.requestURI != csrfTokenGenPath
        ) {
            filterChain.doFilter(request, response)
            logger.info("CSRF token generation skipped")
            return
        }

        val csrfToken: CsrfToken = csrfTokenRepository.generateToken(request)
        csrfTokenRepository.saveToken(csrfToken, request, response)
        if (response.containsHeader("Set-Cookie")) {
            val cookieHeader = response.getHeader("Set-Cookie")
            var updatedCookie = cookieHeader
            if (!updatedCookie.contains("SameSite")) {
                updatedCookie += "; SameSite=$sameSite"
            }
            response.setHeader("Set-Cookie", updatedCookie)
        }
        request.setAttribute(CsrfToken::class.java.name, csrfToken)
        request.setAttribute(csrfToken.parameterName, csrfToken.token)
        filterChain.doFilter(request, response)
    }
}