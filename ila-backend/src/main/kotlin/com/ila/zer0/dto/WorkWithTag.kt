package com.ila.zer0.dto

import com.ila.zer0.entity.Tag
import com.ila.zer0.entity.Work

data class WorkWithTag(
    val work: Work,
    val tags: List<Tag>
)