package com.ila.zer0.config.filter

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.servlet.FilterChain
import org.slf4j.LoggerFactory

class FirebaseAuthFilter(
    private val firebaseAuth: FirebaseAuth,
    private val noBearerTokenPathSet: Set<String>
) : OncePerRequestFilter() {

    @Override
    @kotlin.Throws(jakarta.servlet.ServletException::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val logger = LoggerFactory.getLogger(FirebaseAuthFilter::class.java)
        val requestURI = request.requestURI

        // デバッグ用: リクエストヘッダー情報をログ出力
        val authHeader = request.getHeader("Authorization")

        if (requestURI !in noBearerTokenPathSet) {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                val idToken = authHeader.substring(7)
                try {
                    val decodedToken: FirebaseToken = firebaseAuth.verifyIdToken(idToken)

                    // 認証成功
                    logger.info("Token claims: ${decodedToken.claims}")
                    val customAuthentication = CustomAuthenticationToken(
                        userId = decodedToken.uid
                    )
                    SecurityContextHolder.getContext().authentication = customAuthentication
                    logger.info("Authentication set successfully")
                } catch (e: Exception) {
                    logger.error("Firebase token verification failed: ${e.message}", e)
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Firebase ID token")
                    return
                }
            } else {
                logger.warn("No valid Authorization header found for protected path: $requestURI")
                logger.warn("Expected format: 'Bearer <token>'")
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header required")
                return
            }
        } else {
            logger.info("URI $requestURI does not require authentication, skipping filter")
        }
        filterChain.doFilter(request, response)
    }
}