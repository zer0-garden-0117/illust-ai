package com.ila.zer0.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.sqs.SqsClient

@Configuration
@EnableScheduling
class SqsConfig(
    @Value("\${sqs.region:us-east-1}") private val region: String,
    @Value("\${sqs.create-image-queue-url:your-create-image-queue-url}") val createImageQueueUrl: String,
    @Value("\${sqs.invoice-paid-queue-url:your-invoice-paid-queue-url}") val invoicePaidQueueUrl: String,
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
}