package com.ila.zer0.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider
import software.amazon.awssdk.regions.Region
import org.springframework.beans.factory.annotation.Value
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient

@Configuration
class BedrockConfig(
    @Value("\${s3.region:us-east-1}") private val region: String,
) {
    @Autowired
    private lateinit var credentialsProvider: AwsCredentialsProvider

    @Bean
    fun bedrockRuntimeClient(): BedrockRuntimeClient {
        return BedrockRuntimeClient.builder()
            .region(Region.of(region))
            .credentialsProvider(credentialsProvider)
            .build()
    }

}