package com.ila.zer0.mapper

import com.ila.zer0.entity.Liked
import com.ila.zer0.generated.model.ApiLiked
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
}