package com.ila.zer0.dto

import com.ila.zer0.entity.Liked

data class LikedWithSearchResult(
    val liked: List<Liked>,
    val totalCount: Int,
)