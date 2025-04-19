package com.asb.zer0.dto

import com.asb.zer0.entity.Tag
import com.asb.zer0.entity.Work

data class WorkWithTag(
    val work: Work,
    val tags: List<Tag>
)