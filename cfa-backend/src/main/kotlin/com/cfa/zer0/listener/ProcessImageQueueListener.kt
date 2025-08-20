package com.cfa.zer0.listener

import com.cfa.zer0.service.ConvertService
import com.cfa.zer0.service.S3Service
import com.fasterxml.jackson.databind.ObjectMapper
import io.awspring.cloud.sqs.annotation.SqsListener
import io.awspring.cloud.sqs.annotation.SqsListenerAcknowledgementMode
import io.awspring.cloud.sqs.listener.acknowledgement.Acknowledgement
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ProcessImageQueueListener(
    private val objectMapper: ObjectMapper,
    private val convertService: ConvertService,
    private val s3Service: S3Service,
) {
    // ロガーを追加
    private val logger = LoggerFactory.getLogger(this::class.java)

    @SqsListener("\${sqs.process-image-queue-url}", acknowledgementMode = SqsListenerAcknowledgementMode.MANUAL)
    fun processMessage(message: String, acknowledgement: Acknowledgement) {
        logger.info("Received SQS message: $message") // 受信メッセージをログに出力

        try {
            // JSONパース
            logger.debug("Attempting to parse message JSON")
            val messageData = objectMapper.readValue(message, Map::class.java)
            logger.debug("Parsed message data: $messageData")

            // フィールド取得
            val workId = messageData["workId"] as String
            val imageUrl = messageData["imageUrl"] as String
            logger.info("Processing workId: $workId, imageUrl: $imageUrl")

            // 画像加工
            logger.debug("Starting image resize")
            val imageByteArray = convertService.resize(imageUrl)
            logger.debug("Image resize completed, size: ${imageByteArray.size} bytes")

            // S3アップロード
            logger.debug("Uploading to S3")
            s3Service.uploadToS3(imageByteArray, "$workId.jpeg", "image/jpeg")
            logger.info("Successfully uploaded to S3: $workId.jpeg")

            // ACK送信
            logger.debug("Sending ACK")
            acknowledgement.acknowledge()
            logger.info("Message processed successfully and acknowledged")

        } catch (e: Exception) {
            logger.error("Error processing SQS message", e) // エラー詳細をログに出力
            throw RuntimeException("Failed to process SQS message", e)
        }
    }
}