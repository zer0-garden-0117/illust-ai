package com.cfa.zer0.dto

import com.cfa.zer0.entity.Tag
import com.cfa.zer0.entity.Work

data class WorkWithTag(
    val work: Work,
    val tags: List<Tag>
)