package com.uag.zer0.repository

import com.uag.zer0.entity.UserLike
import com.uag.zer0.entity.UserLikeId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface UserLikeRepository : CrudRepository<UserLike, UserLikeId> {
    fun findByUserLikeIdUserId(userId: String): List<UserLike>
    fun findByUserLikeIdWorkId(workId: String): List<UserLike>
}