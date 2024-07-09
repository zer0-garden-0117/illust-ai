package com.uag.zer0.repository

import com.uag.zer0.entity.Image
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface ImageRepository : CrudRepository<Image, String> {
    fun findByWorkId(workId: String): List<Image>
}