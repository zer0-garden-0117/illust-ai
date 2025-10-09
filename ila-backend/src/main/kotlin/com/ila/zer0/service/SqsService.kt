package com.ila.zer0.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.ila.zer0.config.SqsConfig
import com.ila.zer0.service.user.UserManagerService
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import software.amazon.awssdk.services.sqs.SqsClient
import software.amazon.awssdk.services.sqs.model.SendMessageRequest
import software.amazon.awssdk.services.sqs.model.ReceiveMessageRequest
import software.amazon.awssdk.services.sqs.model.DeleteMessageRequest
import java.time.Instant
import java.util.*

@Service
class SqsService(
    private val sqsClient: SqsClient,
    private val sqsConfig: SqsConfig,
    private val userManagerService: UserManagerService
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val mapper = ObjectMapper()
    
    fun sendCreateImageMessage(workId: String, action: String, prompt: String, nowDate: Instant): String {
        val message = mapOf(
            "workId" to workId,
            "action" to action,
            "workflow" to "workflow1.json",
            "prompt" to prompt,
            "timestamp" to nowDate.toString()
        )
        val messageJson = mapper.writeValueAsString(message)

        val request = SendMessageRequest.builder()
            .queueUrl(sqsConfig.createImageQueueUrl)
            .messageBody(messageJson)
            .messageGroupId("create-image")
            .messageDeduplicationId(UUID.randomUUID().toString())
            .build()

        val response = sqsClient.sendMessage(request)
        return response.messageId()
    }

    @Scheduled(fixedDelayString = "10000")
    fun pollInvoicePaidQueue() {
        val req = ReceiveMessageRequest.builder()
            .queueUrl(sqsConfig.invoicePaidQueueUrl)
            .maxNumberOfMessages(10)
            .waitTimeSeconds(20)
            .visibilityTimeout(60)
            .build()

        val resp = sqsClient.receiveMessage(req)
        if (resp.messages().isEmpty()) return

        resp.messages().forEach { msg ->
            try {
                handleInvoicePaidMessage(msg.body())
                // 成功時は削除
//                sqsClient.deleteMessage(
//                    DeleteMessageRequest.builder()
//                        .queueUrl(sqsConfig.invoicePaidQueueUrl)
//                        .receiptHandle(msg.receiptHandle())
//                        .build()
//                )
//                log.info("Deleted message: ${msg.messageId()}")
            } catch (ex: Exception) {
                log.error("Failed to process message: ${msg.messageId()}", ex)
            }
        }
    }

    private fun handleInvoicePaidMessage(body: String) {
        val node = mapper.readTree(body)
        val eventType = node.path("type").asText(null)
        log.info("Received invoicePaid message: type=$eventType, body=$body")

        // TODO: DynamoDB更新やStripeイベント処理などをここに実装
//        userManagerService.updateUser()
    }
}