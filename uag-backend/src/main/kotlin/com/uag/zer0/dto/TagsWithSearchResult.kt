package com.uag.zer0.dto

import com.uag.zer0.entity.work.Tag

data class TagsWithSearchResult(
    val tags: List<Tag>,
    val totalCount: Int,
)