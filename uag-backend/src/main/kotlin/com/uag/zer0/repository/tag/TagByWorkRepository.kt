package com.uag.zer0.repository.tag

import com.uag.zer0.entity.tag.TagByWork
import com.uag.zer0.entity.tag.TagByWorkId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

@EnableScan
interface TagByWorkRepository : CrudRepository<TagByWork, TagByWorkId> {
    fun findByTagByWorkIdTagName(@Param("tagName") tagName: String): List<TagByWork>
    fun findByTagByWorkIdTagNameContaining(@Param("tagName") partialTagName: String): List<TagByWork>
}