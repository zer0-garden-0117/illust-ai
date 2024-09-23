package com.uag.zer0.dto

import com.uag.zer0.entity.user.Liked

data class LikedWithSearchResult(
    val liked: List<Liked>,
    val totalCount: Int,
)