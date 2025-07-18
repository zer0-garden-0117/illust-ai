package com.cfa.zer0.dto

import com.cfa.zer0.entity.Liked

data class LikedWithSearchResult(
    val liked: List<Liked>,
    val totalCount: Int,
)