package com.ila.zer0.config.token

import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority

data class CustomAuthenticationToken(
    val id: Int? = null,
    val userId: String? = null,
    val userName: String? = null,
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
        return id
    }

    override fun toString(): String {
        return "CustomAuthenticationToken(id=$id, userId=$userId, role=$role, authorities=$authorities)"
    }
}