package com.ila.zer0.converter

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

@Component
class LocalDateTimeConverter : DynamoDBTypeConverter<String, LocalDateTime> {

    override fun convert(localDateTime: LocalDateTime): String {
        return localDateTime.atOffset(ZoneOffset.UTC)
            .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
    }

    override fun unconvert(isoDate: String): LocalDateTime {
        return LocalDateTime.parse(
            isoDate,
            DateTimeFormatter.ISO_OFFSET_DATE_TIME
        )
    }
}