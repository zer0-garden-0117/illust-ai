package com.uag.zer0.repository.tag

import com.uag.zer0.entity.tag.TagByCategory
import com.uag.zer0.entity.tag.TagByCategoryId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

@EnableScan
interface TagByCategoryRepository :
    CrudRepository<TagByCategory, TagByCategoryId> {
    fun findByTagByCategoryIdTagName(@Param("tagName") tagName: String): List<TagByCategory>
    fun findByTagByCategoryIdTagNameIn(@Param("tagNames") tagNames: List<String>): List<TagByCategory>
}