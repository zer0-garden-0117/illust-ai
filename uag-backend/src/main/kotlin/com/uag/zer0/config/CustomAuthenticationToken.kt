package com.uag.zer0.config

import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority

data class CustomAuthenticationToken(
    val memberId: Int? = null,
    val email: String? = null,
    val role: String? = null,
    val customAuthorities: Collection<GrantedAuthority>? = null
) : AbstractAuthenticationToken(customAuthorities) {
    init {
        isAuthenticated = true
    }

    override fun getCredentials(): Any? {
        return null
    }

    override fun getPrincipal(): Int? {
        return memberId
    }

    override fun toString(): String {
        return "CustomAuthenticationToken(memberId=$memberId, email=$email, role=$role, authorities=$authorities)"
    }
}