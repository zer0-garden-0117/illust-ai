package com.ila.zer0.mapper

import com.ila.zer0.entity.Liked
import com.ila.zer0.entity.User
import com.ila.zer0.generated.model.ApiLiked
import com.ila.zer0.generated.model.ApiUser
import org.mapstruct.Mapper
import org.mapstruct.Mapping

@Mapper(componentModel = "spring", uses = [DateTimeMapper::class])
interface UserMapper {
    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["offsetDateTimeToInstant"]
    )
    fun toLiked(apiLiked: ApiLiked): Liked

    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    fun toApiLiked(liked: Liked): ApiLiked

    @Mapping(
        source = "createdAt",
        target = "createdAt",
        qualifiedByName = ["offsetDateTimeToInstant"]
    )
    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["offsetDateTimeToInstant"]
    )
    @Mapping(target = "follow", ignore = true)
    @Mapping(target = "follower", ignore = true)
    fun toUser(apiUser: ApiUser): User

    @Mapping(
        source = "createdAt",
        target = "createdAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    fun toApiUser(user: User): ApiUser
}