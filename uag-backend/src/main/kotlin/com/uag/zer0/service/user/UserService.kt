package com.uag.zer0.service.user

import com.uag.zer0.entity.user.User
import com.uag.zer0.repository.user.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository
) {

    fun hasUser(email: String): User? {
        return userRepository.findByUserId(email)
    }
}