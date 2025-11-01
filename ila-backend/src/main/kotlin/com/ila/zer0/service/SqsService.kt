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
    private val userManagerService: UserManagerService,
    private val stripeService: StripeService
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val mapper = ObjectMapper()
    
    fun sendCreateImageMessage(
        workId: String, action: String, prompt: String, negativePrompt: String, model: String, nowDate: Instant
    ): String {
        val message = mapOf(
            "workId" to workId,
            "action" to action,
            "model" to model,
            "prompt" to prompt,
            "negativePrompt" to negativePrompt,
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

//    @Scheduled(fixedDelayString = "10000")
//    fun pollInvoicePaidQueue() {
//        val req = ReceiveMessageRequest.builder()
//            .queueUrl(sqsConfig.invoicePaidQueueUrl)
//            .maxNumberOfMessages(10)
//            .waitTimeSeconds(20)
//            .visibilityTimeout(60)
//            .build()
//
//        val resp = sqsClient.receiveMessage(req)
//        if (resp.messages().isEmpty()) return
//
//        resp.messages().forEach { msg ->
//            try {
//                val res = handleInvoicePaidMessage(msg.body())
//                if (!res) {
//                    log.warn("Failed to handle invoice paid message: ${msg.messageId()}")
//                    return@forEach
//                }
//                sqsClient.deleteMessage(
//                    DeleteMessageRequest.builder()
//                        .queueUrl(sqsConfig.invoicePaidQueueUrl)
//                        .receiptHandle(msg.receiptHandle())
//                        .build()
//                )
//                log.info("Deleted message: ${msg.messageId()}")
//            } catch (ex: Exception) {
//                log.error("Failed to process message: ${msg.messageId()}", ex)
//            }
//        }
//    }
//
//    private fun handleInvoicePaidMessage(body: String): Boolean {
//        val root = mapper.readTree(body)
//
//        val detailType = root.path("detail-type").asText()
//        log.info("Processing message with detail-type: $detailType")
//
//        val metadata = root.path("detail")?.path("data")?.path("object")?.path("metadata")
//        log.info("Metadata: $metadata")
//
//        val linesMetadatas = root.path("detail")?.path("data")?.path("object")?.path("lines")?.path("data")?.firstOrNull()?.path("metadata")
//        log.info("Lines metadata: $linesMetadatas")
//
//        // detail-typeが"payment_intent.succeeded"で かつ metadataが存在しない場合は何もしない
//        if ((detailType == "payment_intent.succeeded") && ((metadata == null) || metadata.isEmpty())) {
//            log.info("Skipping message: detail-type is not 'invoice.paid' or metadata is missing")
//            return true
//        }
//
//        val appUserId = metadata?.path("app_user_id")?.asText(null)
//            ?: linesMetadatas?.path("app_user_id")?.asText(null)
//        val appPriceId = metadata?.path("app_price_id")?.asText(null)
//            ?: linesMetadatas?.path("app_price_id")?.asText(null)
//        val isPlan = metadata?.path("is_plan")?.asText(null)?.toBoolean()
//            ?: linesMetadatas?.path("is_plan")?.asText(null)?.toBoolean()
//        log.info("appUserId: $appUserId, appPriceId: $appPriceId, isPlan: $isPlan")
//
//        // appUserId、appPriceId、isPlanのいずれかが存在しない場合は何もしない
//        if (appUserId == null || appPriceId == null || isPlan == null) {
//            log.warn("Skipping message: Missing required metadata (appUserId, appPriceId, isPlan)")
//            return false
//        }
//
//        // プロダクト取得
//        val product = stripeService.toProduct(appPriceId)
//
//        // ユーザー取得
//        val user = userManagerService.getUserById(appUserId) ?: run {
//            log.warn("User not found: $appUserId")
//            return false
//        }
//
//        // ユーザーのプラン、ブーストの更新
//        if (isPlan) {
//            log.info("Updating plan for user $appUserId to product $appPriceId")
//            userManagerService.updatePlan(user, product)
//        } else {
//            log.info("Updating boost for user $appUserId to product $appPriceId")
//            val supportTo = stripeService.calSupportTo(appPriceId)
//            log.info("Support to date: $supportTo")
//            userManagerService.updateBoost(user, product, supportTo)
//        }
//        return true
//    }
}