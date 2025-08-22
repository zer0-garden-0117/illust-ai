package com.ila.zer0.service

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Service
import software.amazon.awssdk.services.sqs.SqsClient
import software.amazon.awssdk.services.sqs.model.SendMessageRequest
import java.time.Instant
import java.util.*

@Service
class SqsService(
    private val sqsClient: SqsClient,
    private val createImageQueueUrl: String
) {
    fun sendCreateImageMessage(workId: String, action: String, prompt: String, nowDate: Instant): String {
        val message = mapOf(
            "workId" to workId,
            "action" to action,
            "workflow" to "workflow1.json",
            "prompt" to prompt,
            "timestamp" to nowDate.toString()
        )
        val messageJson = ObjectMapper().writeValueAsString(message)

        val request = SendMessageRequest.builder()
            .queueUrl(createImageQueueUrl)
            .messageBody(messageJson)
            .messageGroupId("create-image")
            .messageDeduplicationId(UUID.randomUUID().toString())
            .build()

        val response = sqsClient.sendMessage(request)
        return response.messageId()
    }
}