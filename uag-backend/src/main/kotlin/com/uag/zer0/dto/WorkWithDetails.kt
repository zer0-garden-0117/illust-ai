package com.uag.zer0.dto

import com.uag.zer0.entity.work.*

data class WorkWithDetails(
    val work: Work,
    val characters: List<Character>?,
    val creators: List<Creator>?,
    val tags: List<Tag>?,
    val imgs: List<Img>
)