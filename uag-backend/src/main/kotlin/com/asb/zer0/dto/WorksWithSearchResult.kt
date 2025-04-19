package com.asb.zer0.dto

import com.asb.zer0.entity.Work

data class WorksWithSearchResult(
    val works: List<Work>,
    val totalCount: Int,
)