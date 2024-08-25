package com.uag.zer0.mapper

import com.uag.zer0.entity.work.Character
import com.uag.zer0.entity.work.Creator
import com.uag.zer0.entity.work.Tag
import com.uag.zer0.entity.work.Work
import com.uag.zer0.generated.model.ApiCharacter
import com.uag.zer0.generated.model.ApiCreator
import com.uag.zer0.generated.model.ApiTag
import com.uag.zer0.generated.model.ApiWork
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
}