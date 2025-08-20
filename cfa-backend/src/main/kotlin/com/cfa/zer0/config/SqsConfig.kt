package com.cfa.zer0.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.sqs.SqsClient

@Configuration
class SqsConfig(
    @Value("\${sqs.region:us-east-1}") private val region: String,
    @Value("\${sqs.create-image-queue-url:your-create-image-queue-url}") private val createImageQueueUrl: String,
    @Value("\${sqs.process-image-queue-url:your-process-image-queue-url}") private val processImageQueueUrl: String,
) {
    @Autowired
    private lateinit var credentialsProvider: AwsCredentialsProvider

    @Bean
    fun sqsClient(): SqsClient {
        return SqsClient.builder()
            .region(Region.of(region))
            .credentialsProvider(credentialsProvider)
            .build()
    }

    @Bean
    fun createImageQueueUrl(): String {
        return createImageQueueUrl
    }
}