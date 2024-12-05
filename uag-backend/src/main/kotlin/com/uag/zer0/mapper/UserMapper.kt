package com.uag.zer0.mapper

import com.uag.zer0.entity.Liked
import com.uag.zer0.entity.Rated
import com.uag.zer0.generated.model.ApiLiked
import com.uag.zer0.generated.model.ApiRated
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
        qualifiedByName = ["offsetDateTimeToInstant"]
    )
    fun toRated(apiRated: ApiRated): Rated

    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    fun toApiLiked(liked: Liked): ApiLiked

    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    fun toApiRated(rated: Rated): ApiRated
}