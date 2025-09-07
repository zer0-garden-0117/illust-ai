package com.ila.zer0.service.user

import com.ila.zer0.entity.User
import com.ila.zer0.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
) {
    private val logger = LoggerFactory.getLogger(UserService::class.java)

    fun findUserById(userId: String): User? {
        return userRepository.findByUserId(userId)
    }

    fun findUserByCustomUserId(customUserId: String): User? {
        return userRepository.findByCustomUserId(customUserId)
    }

    fun registerUser(user: User): User {
        return userRepository.registerUser(user)
    }

    fun updateUser(user: User): User {
        return userRepository.updateUser(user)
    }

    fun deleteUserById(userId: String): User {
        return userRepository.deleteUserById(userId)
    }
}