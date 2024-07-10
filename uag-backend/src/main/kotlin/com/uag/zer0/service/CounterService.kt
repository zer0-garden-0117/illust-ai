package com.uag.zer0.service

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB
import com.amazonaws.services.dynamodbv2.model.AttributeValue
import com.amazonaws.services.dynamodbv2.model.ReturnValue
import com.amazonaws.services.dynamodbv2.model.UpdateItemRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class CounterService(@Autowired private val dynamoDB: AmazonDynamoDB) {

    private fun getNextId(counterName: String): Long {
        val updateItemRequest = UpdateItemRequest()
            .withTableName("counters")
            .withKey(mapOf("counter_name" to AttributeValue().withS(counterName)))
            .withUpdateExpression("SET counter_value = if_not_exists(counter_value, :start) + :increment")
            .withExpressionAttributeValues(
                mapOf(
                    ":increment" to AttributeValue().withN("1"),
                    ":start" to AttributeValue().withN("0")
                )
            )
            .withReturnValues(ReturnValue.UPDATED_NEW)

        val result = dynamoDB.updateItem(updateItemRequest)
        return result.attributes["counter_value"]?.n?.toLong()
            ?: throw RuntimeException("Failed to get next ID")
    }

    fun getNextWorkId(): Long {
        return getNextId("work_id")
    }

    fun getNextTagId(): Long {
        return getNextId("tag_id")
    }

    fun getNextImageId(): Long {
        return getNextId("img_id")
    }
}