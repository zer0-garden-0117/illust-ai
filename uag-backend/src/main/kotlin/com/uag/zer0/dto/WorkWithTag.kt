package com.uag.zer0.dto

import com.uag.zer0.entity.Tag
import com.uag.zer0.entity.Work

data class WorkWithTag(
    val work: Work,
    val tags: List<Tag>
)