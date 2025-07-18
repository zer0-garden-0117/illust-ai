package com.cfa.zer0.dto

import com.cfa.zer0.entity.Work

data class WorksWithSearchResult(
    val works: List<Work>,
    val totalCount: Int,
)