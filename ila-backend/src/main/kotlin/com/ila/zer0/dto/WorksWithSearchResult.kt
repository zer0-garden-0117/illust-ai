package com.ila.zer0.dto

import com.ila.zer0.entity.Work

data class WorksWithSearchResult(
    val works: List<Work>,
    val totalCount: Int,
)