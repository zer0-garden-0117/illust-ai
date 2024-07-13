package com.uag.zer0.repository

import com.uag.zer0.entity.WorkTag
import com.uag.zer0.entity.WorkTagId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface WorkTagRepository : CrudRepository<WorkTag, WorkTagId> {
    fun findByWorkTagIdWorkId(workId: String): List<WorkTag>
    fun findByWorkTagIdTagId(tagId: String): List<WorkTag>
}