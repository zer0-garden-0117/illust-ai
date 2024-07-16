package com.uag.zer0.repository.tag

import com.uag.zer0.entity.tag.CategoryByTag
import com.uag.zer0.entity.tag.CategoryByTagId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

@EnableScan
interface CategoryByTagRepository :
    CrudRepository<CategoryByTag, CategoryByTagId> {
    fun findByCategoryByTagIdCategoryName(@Param("categoryName") categoryName: String): List<CategoryByTag>
}