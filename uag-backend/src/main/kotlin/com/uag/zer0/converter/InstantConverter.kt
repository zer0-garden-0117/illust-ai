package com.uag.zer0.converter

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class InstantConverter :
    DynamoDBTypeConverter<String, Instant> { // 修正: LocalDateTimeConverter から InstantConverter に変更

    override fun convert(instant: Instant): String {
        return instant.toString() // ISO_INSTANT形式でフォーマットされます
    }

    override fun unconvert(isoDate: String): Instant {
        return Instant.parse(isoDate) // ISO_INSTANT形式を解析します
    }
}