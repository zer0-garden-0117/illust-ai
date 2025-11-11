package com.ila.zer0.dto

import com.ila.zer0.entity.Tagged

data class TaggedWithSearchResult(
    val taggeds: List<Tagged>,
    val totalCount: Int,
)