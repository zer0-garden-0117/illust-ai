package com.cfa.zer0.dto

import com.cfa.zer0.entity.Liked
import com.cfa.zer0.entity.Rated

data class UsersActivity(
    val liked: List<Liked>,
    val rated: List<Rated>,
)