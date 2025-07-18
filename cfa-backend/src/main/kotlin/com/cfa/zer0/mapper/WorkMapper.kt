package com.cfa.zer0.mapper

import com.cfa.zer0.entity.Work
import com.cfa.zer0.generated.model.ApiWork
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
    @Mapping(target = "rateSum", ignore = true)
    @Mapping(target = "rateCount", ignore = true)
    @Mapping(target = "rate", ignore = true)
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