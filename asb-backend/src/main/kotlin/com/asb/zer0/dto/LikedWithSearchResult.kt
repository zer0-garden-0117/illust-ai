package com.asb.zer0.dto

import com.asb.zer0.entity.Liked

data class LikedWithSearchResult(
    val liked: List<Liked>,
    val totalCount: Int,
)