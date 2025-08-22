package com.ila.zer0.dto

import com.ila.zer0.entity.Rated

data class RatedWithSearchResult(
    val rated: List<Rated>,
    val totalCount: Int,
)