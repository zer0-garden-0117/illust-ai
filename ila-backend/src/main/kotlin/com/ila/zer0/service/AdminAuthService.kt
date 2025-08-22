package com.ila.zer0.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class AdminAuthService(
    @Value("\${admin.key:test}") private val adminKey: String,
) {

    fun validateInternalKey(key: String?): Boolean {
        return key == adminKey
    }
}