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
                val res = handleInvoicePaidMessage(msg.body())
                if (!res) {
                    log.warn("Failed to handle invoice paid message: ${msg.messageId()}")
                    return@forEach
                }
//                sqsClient.deleteMessage(
//                    DeleteMessageRequest.builder()
//                        .queueUrl(sqsConfig.invoicePaidQueueUrl)
//                        .receiptHandle(msg.receiptHandle())
//                        .build()
//                )
                log.info("Deleted message: ${msg.messageId()}")
            } catch (ex: Exception) {
                log.error("Failed to process message: ${msg.messageId()}", ex)
            }
        }
    }

    private fun handleInvoicePaidMessage(body: String): Boolean {
        val root = mapper.readTree(body)

        // "detail-type"が"invoice.paid"でない場合は無視
        val detailType = root.path("detail-type").asText(null)
        log.info("Processing message with detail-type: $detailType")

        // detailを取得
        val invoice = root.path("detail").path("data").path("object")
        val firstLine = invoice.path("lines").path("data").let { arr ->
            if (arr.isArray && arr.size() > 0) arr.get(0) else null
        }

        // app_user_idを取得
        val appUserIdFromLine = firstLine?.path("metadata")?.path("app_user_id")?.asText(null)
        val appUserIdFromParent = invoice
            .path("parent")
            .path("subscription_details")
            .path("metadata")
            .path("app_user_id")
            .asText(null)
        val appUserId = appUserIdFromLine ?: appUserIdFromParent

        // priceIdを取得
        val priceId = firstLine
            ?.path("pricing")
            ?.path("price_details")
            ?.path("price")
            ?.asText(null)

        if (appUserId == null || priceId == null) {
            log.warn("Missing app_user_id or price_id in invoice: app_user_id=$appUserId, price_id=$priceId")
            return false
        }

        log.info(
            "InvoicePaid extracted: app_user_id={}, price_id={}",
            appUserId,
            priceId
        )

        val isPlan = stripeService.isPlan(priceId)
        if (isPlan) {
            // サブスクの場合はinvoice.paidで処理するためスキップ
            return true
        }

        // ユーザーを取得
        val user = userManagerService.getUserById(appUserId)
        if (user == null) {
            log.warn("User not found for app_user_id=$appUserId")
            return false
        }
        log.info("user=${user})")

        // priceIdからproductを判定
        val product = stripeService.toProduct(priceId)
        log.info("product=$product, isPlan=$isPlan")

        // ユーザーのplan,boostを更新
        if (isPlan) {
            userManagerService.updatePlan(user, product)
        } else {
            val supportTo = stripeService.calSupportTo(priceId)
            log.info("supportTo=$supportTo")
            userManagerService.updateBoost(user, product, supportTo)
        }

        return true
    }
}