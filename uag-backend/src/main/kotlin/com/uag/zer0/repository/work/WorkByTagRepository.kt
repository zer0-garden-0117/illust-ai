package com.uag.zer0.repository.work

import com.uag.zer0.entity.work.WorkByTag
import com.uag.zer0.entity.work.WorkByTagId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

@EnableScan
interface WorkByTagRepository : CrudRepository<WorkByTag, WorkByTagId> {

    fun findByWorkByTagIdWorkId(@Param("workId") workId: String): List<WorkByTag>
}