package com.ila.zer0.mapper

import com.ila.zer0.entity.Work
import com.ila.zer0.generated.model.ApiWork
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
    @Mapping(
        source = "postedAt",
        target = "postedAt",
        qualifiedByName = ["offsetDateTimeToInstant"]
    )
    @Mapping(target = "rateSum", ignore = true)
    @Mapping(target = "rateCount", ignore = true)
    @Mapping(target = "rate", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "ttl", ignore = true)
    @Mapping(target = "expiredAt", ignore = true)
    @Mapping(target = "model", ignore = true)
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
    @Mapping(
        source = "expiredAt",
        target = "expiredAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    @Mapping(
        source = "postedAt",
        target = "postedAt",
        qualifiedByName = ["instantToOffsetDateTime"]
    )
    fun toApiWork(work: Work): ApiWork
}