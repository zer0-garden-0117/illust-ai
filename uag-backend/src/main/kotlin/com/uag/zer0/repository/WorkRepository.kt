package com.uag.zer0.repository

import com.uag.zer0.entity.Work
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface WorkRepository : CrudRepository<Work, String> {
    fun findByWorkFormat(workFormat: String): List<Work>
    fun findByMainTitle(mainTitle: String): List<Work>
    fun findByCreator(creator: String): List<Work>
}