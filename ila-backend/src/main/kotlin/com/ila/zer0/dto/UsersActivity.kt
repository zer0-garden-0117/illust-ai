package com.ila.zer0.dto

import com.ila.zer0.entity.Liked
import com.ila.zer0.entity.Rated

data class UsersActivity(
    val liked: List<Liked>,
    val rated: List<Rated>,
)