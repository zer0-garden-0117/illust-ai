package com.uag.zer0.mapper

import com.uag.zer0.entity.user.Liked
import com.uag.zer0.entity.user.Rated
import com.uag.zer0.entity.user.Viewed
import com.uag.zer0.generated.model.ApiLiked
import com.uag.zer0.generated.model.ApiRated
import com.uag.zer0.generated.model.ApiViewed
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
        qualifiedByName = ["offsetDateTimeToInstant"]
    )
    fun toViewed(apiViewed: ApiViewed): Viewed

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
    
    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    fun toApiViewed(viewed: Viewed): ApiViewed
}