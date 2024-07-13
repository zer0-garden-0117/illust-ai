package com.uag.zer0.repository

import com.uag.zer0.entity.UserView
import com.uag.zer0.entity.UserViewId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface UserViewRepository : CrudRepository<UserView, UserViewId> {
    fun findByUserViewIdUserId(userId: String): List<UserView>
    fun findByUserViewIdWorkId(workId: String): List<UserView>
}