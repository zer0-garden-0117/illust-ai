package com.ila.zer0.dto

import com.ila.zer0.entity.Tag

data class TagsWithSearchResult(
    val tags: List<Tag>,
    val totalCount: Int,
)