package com.uag.zer0.repository.user

import com.uag.zer0.entity.user.User
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

@EnableScan
interface UserRepository : CrudRepository<User, String> {
    fun findByUserId(@Param("userId") userId: String): User?
}