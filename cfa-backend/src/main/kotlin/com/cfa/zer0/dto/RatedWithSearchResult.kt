package com.cfa.zer0.dto

import com.cfa.zer0.entity.Rated

data class RatedWithSearchResult(
    val rated: List<Rated>,
    val totalCount: Int,
)