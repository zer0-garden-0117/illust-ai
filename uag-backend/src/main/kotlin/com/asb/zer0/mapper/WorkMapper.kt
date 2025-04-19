package com.asb.zer0.mapper

import com.asb.zer0.entity.Work
import com.asb.zer0.generated.model.ApiWork
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
}