package com.uag.zer0.dto

import com.uag.zer0.entity.Work

data class WorksWithSearchResult(
    val works: List<Work>,
    val totalCount: Int,
)