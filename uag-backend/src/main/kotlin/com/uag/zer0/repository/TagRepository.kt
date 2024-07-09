package com.uag.zer0.repository

import com.uag.zer0.entity.Tag
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface TagRepository : CrudRepository<Tag, String> {
    fun findByName(name: String): Tag?
}