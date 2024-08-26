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

    fun toCreator(apiCreator: ApiCreator): Creator
    fun toCharacter(apiCharacter: ApiCharacter): Character
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
    fun toApiCharacter(character: Character): ApiCharacter
    fun toApiCreator(creator: Creator): ApiCreator
    fun toApiTag(tag: Tag): ApiTag
    fun toApiImg(img: Img): ApiImg
}