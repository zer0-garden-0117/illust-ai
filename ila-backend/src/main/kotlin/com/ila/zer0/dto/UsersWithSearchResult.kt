package com.ila.zer0.dto

import com.ila.zer0.entity.User

data class UsersWithSearchResult(
    val users: List<User>,
    val totalCount: Int,
)