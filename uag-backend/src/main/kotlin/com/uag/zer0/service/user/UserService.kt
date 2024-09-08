package com.uag.zer0.service.user

import com.uag.zer0.entity.user.User
import com.uag.zer0.repository.user.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
) {
    private val logger = LoggerFactory.getLogger(UserService::class.java)

    fun hasUser(userId: String): User? {
        val users = userRepository.findByUserId(userId)
        return users
    }

    fun registerUser(userId: String): User {
        val user = User(
            userId = userId,
            userRole = "user"
        )
        return userRepository.registerUser(user)
    }

}