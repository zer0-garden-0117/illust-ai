package com.uag.zer0.repository.work

import com.uag.zer0.entity.work.DescriptionByWork
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface DescriptionByWorkRepository :
    CrudRepository<DescriptionByWork, String> {
    fun findByDescriptionContaining(partialTitle: String): List<DescriptionByWork>
}