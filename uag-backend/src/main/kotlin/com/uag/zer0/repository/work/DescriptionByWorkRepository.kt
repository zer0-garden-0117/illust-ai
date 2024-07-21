package com.uag.zer0.repository.work

import com.uag.zer0.entity.work.DescriptionByWork
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

@EnableScan
interface DescriptionByWorkRepository :
    CrudRepository<DescriptionByWork, String> {
    fun findByWorkId(@Param("workId") workId: String): DescriptionByWork?
}