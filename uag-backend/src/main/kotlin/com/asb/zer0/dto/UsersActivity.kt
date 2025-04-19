package com.asb.zer0.dto

import com.asb.zer0.entity.Liked
import com.asb.zer0.entity.Rated

data class UsersActivity(
    val liked: List<Liked>,
    val rated: List<Rated>,
)