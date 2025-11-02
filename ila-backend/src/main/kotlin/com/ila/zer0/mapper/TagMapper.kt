package com.ila.zer0.mapper

import com.ila.zer0.entity.Tag
import com.ila.zer0.generated.model.ApiTag
import org.springframework.stereotype.Component

@Component
class TagMapper {

    fun toApiTag(tags: List<Tag>): ApiTag {
        val allTags = mutableListOf<String>()
        tags.forEach { tag ->
            allTags.add(tag.tag)
        }
        return ApiTag(tags = allTags)
    }
}