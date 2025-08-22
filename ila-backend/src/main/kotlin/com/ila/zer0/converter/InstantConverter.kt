package com.ila.zer0.converter

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class InstantConverter :
    DynamoDBTypeConverter<String, Instant> {

    override fun convert(instant: Instant): String {
        return instant.toString()
    }

    override fun unconvert(isoDate: String): Instant {
        return Instant.parse(isoDate)
    }
}