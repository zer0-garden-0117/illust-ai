package com.ila.zer0.dto

import com.ila.zer0.entity.Follow

data class FollowWithSearchResult(
    val follows: List<Follow>,
    val totalCount: Int,
)