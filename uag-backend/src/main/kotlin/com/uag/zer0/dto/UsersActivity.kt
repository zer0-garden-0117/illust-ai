package com.uag.zer0.dto

import com.uag.zer0.entity.user.Liked
import com.uag.zer0.entity.user.Rated

data class UsersActivity(
    val liked: List<Liked>,
    val rated: List<Rated>,
)