package com.uag.zer0.config

import org.slf4j.LoggerFactory
import org.socialsignin.spring.data.dynamodb.repository.config.EnableDynamoDBRepositories
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider
import software.amazon.awssdk.core.client.config.ClientOverrideConfiguration
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbClient

@Configuration
@EnableDynamoDBRepositories(basePackages = ["com.uag.zer0.repository"])
class DynamoDBConfig {
    @Value("\${dynamodb.url}")
    private lateinit var dynamodbUrl: String

    private val logger = LoggerFactory.getLogger(DynamoDBConfig::class.java)

    @Bean
    @Primary
    fun dynamoDbClient(): DynamoDbClient {
        return DynamoDbClient.builder()
            .region(Region.US_EAST_1)
            .endpointOverride(java.net.URI.create(dynamodbUrl))
            .credentialsProvider(DefaultCredentialsProvider.create())
            .overrideConfiguration(
                ClientOverrideConfiguration.builder()
                    .build()
            )
            .build()
    }
}