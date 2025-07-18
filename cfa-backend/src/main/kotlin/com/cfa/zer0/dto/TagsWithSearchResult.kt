package com.cfa.zer0.dto

import com.cfa.zer0.entity.Tag

data class TagsWithSearchResult(
    val tags: List<Tag>,
    val totalCount: Int,
)