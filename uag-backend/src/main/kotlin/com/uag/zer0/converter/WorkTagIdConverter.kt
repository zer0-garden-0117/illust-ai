package com.uag.zer0.converter

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter
import com.uag.zer0.entity.WorkTagId

class WorkTagIdConverter : DynamoDBTypeConverter<String, WorkTagId> {  // 修正箇所
    override fun convert(id: WorkTagId): String {
        return "${id.workId}:${id.tagId}"
    }

    override fun unconvert(idString: String): WorkTagId {
        val parts = idString.split(":")
        return WorkTagId(parts[0], parts[1])
    }
}