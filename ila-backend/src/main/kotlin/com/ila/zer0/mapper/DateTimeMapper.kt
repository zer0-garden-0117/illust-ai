package com.ila.zer0.mapper

import org.mapstruct.Named
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.OffsetDateTime

@Component
object DateTimeMapper {

    @Named("offsetDateTimeToInstant")
    fun offsetDateTimeToInstant(offsetDateTime: OffsetDateTime?): Instant? {
        return offsetDateTime?.toInstant()
    }

    @Named("instantToOffsetDateTime")
    fun instantToOffsetDateTime(instant: Instant?): OffsetDateTime? {
        return instant?.atOffset(OffsetDateTime.now().offset)
    }
}