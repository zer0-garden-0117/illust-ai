package com.uag.zer0.repository.user

import com.uag.zer0.entity.user.UserByViewedWork
import com.uag.zer0.entity.user.UserByViewedWorkId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

@EnableScan
interface UserByViewedWorkRepository :
    CrudRepository<UserByViewedWork, UserByViewedWorkId> {
    fun findByUserByViewedWorkIdUserId(@Param("userId") userId: String): List<UserByViewedWork>
}