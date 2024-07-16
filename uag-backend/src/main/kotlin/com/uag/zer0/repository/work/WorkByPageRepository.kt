package com.uag.zer0.repository.work

import com.uag.zer0.entity.work.WorkByPage
import com.uag.zer0.entity.work.WorkByPageId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

@EnableScan
interface WorkByPageRepository : CrudRepository<WorkByPage, WorkByPageId> {

    fun findByWorkByPageIdWorkId(@Param("workId") workId: String): List<WorkByPage>
}