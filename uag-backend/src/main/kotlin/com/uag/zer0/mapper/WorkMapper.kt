package com.uag.zer0.mapper

import com.uag.zer0.entity.work.*
import com.uag.zer0.generated.model.*
import org.mapstruct.Mapper
import org.mapstruct.Mapping

@Mapper(componentModel = "spring", uses = [DateTimeMapper::class])
interface WorkMapper {
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
    fun toWork(apiWork: ApiWork): Work

    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["offsetDateTimeToInstant"]
    )
    fun toCreator(apiCreator: ApiCreator): Creator

    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["offsetDateTimeToInstant"]
    )
    fun toCharacter(apiCharacter: ApiCharacter): Character

    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["offsetDateTimeToInstant"]
    )
    fun toTag(apiTags: ApiTag): Tag

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
    fun toApiWork(work: Work): ApiWork

    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    fun toApiCharacter(character: Character): ApiCharacter

    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    fun toApiCreator(creator: Creator): ApiCreator

    @Mapping(
        source = "updatedAt",
        target = "updatedAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    fun toApiTag(tag: Tag): ApiTag
    fun toApiImg(img: Img): ApiImg
}