package com.asb.zer0.dto

import com.asb.zer0.entity.Tag

data class TagsWithSearchResult(
    val tags: List<Tag>,
    val totalCount: Int,
)