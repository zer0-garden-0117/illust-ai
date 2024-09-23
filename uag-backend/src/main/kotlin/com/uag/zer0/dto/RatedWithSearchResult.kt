package com.uag.zer0.dto

import com.uag.zer0.entity.user.Rated

data class RatedWithSearchResult(
    val rated: List<Rated>,
    val totalCount: Int,
)