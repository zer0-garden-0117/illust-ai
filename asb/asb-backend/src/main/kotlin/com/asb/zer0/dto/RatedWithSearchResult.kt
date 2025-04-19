package com.asb.zer0.dto

import com.asb.zer0.entity.Rated

data class RatedWithSearchResult(
    val rated: List<Rated>,
    val totalCount: Int,
)