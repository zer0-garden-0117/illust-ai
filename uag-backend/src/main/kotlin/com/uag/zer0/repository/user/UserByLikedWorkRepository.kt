package com.uag.zer0.repository.user

import com.uag.zer0.entity.user.UserByLikedWork
import com.uag.zer0.entity.user.UserByLikedWorkId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

@EnableScan
interface UserByLikedWorkRepository :
    CrudRepository<UserByLikedWork, UserByLikedWorkId> {
    fun findByUserByLikedWorkIdUserId(@Param("userId") userId: String): List<UserByLikedWork>
}