package com.ila.zer0.dto

import com.ila.zer0.entity.Liked

data class UsersActivity(
    val liked: List<Liked>,
)