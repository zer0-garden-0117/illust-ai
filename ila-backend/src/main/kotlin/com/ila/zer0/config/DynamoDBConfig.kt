package com.ila.zer0.config

import org.socialsignin.spring.data.dynamodb.repository.config.EnableDynamoDBRepositories
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider
import software.amazon.awssdk.core.client.config.ClientOverrideConfiguration
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbClient

@Configuration
@EnableDynamoDBRepositories(basePackages = ["com.ila.zer0.repository"])
class DynamoDBConfig(
    @Value("\${dynamodb.region:us-east-1}") private val region: String,
    @Value("\${dynamodb.url:http://localhost:10000}") private val url: String,
) {
    @Autowired
    private lateinit var credentialsProvider: AwsCredentialsProvider


    @Bean
    @Primary
    fun dynamoDbClient(): DynamoDbClient {
        return DynamoDbClient.builder()
            .region(Region.of(region))
            .endpointOverride(java.net.URI.create(url))
            .credentialsProvider(credentialsProvider)
            .overrideConfiguration(
                ClientOverrideConfiguration.builder()
                    .build()
            )
            .build()
    }
}