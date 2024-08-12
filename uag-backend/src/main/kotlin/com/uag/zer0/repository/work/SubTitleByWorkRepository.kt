package com.uag.zer0.repository.work

import com.uag.zer0.entity.work.SubTitleByWork
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface SubTitleByWorkRepository : CrudRepository<SubTitleByWork, String> {
    fun findBySubTitleContaining(partialTitle: String): List<SubTitleByWork>
}