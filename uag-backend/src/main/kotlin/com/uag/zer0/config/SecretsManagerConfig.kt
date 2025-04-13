package com.uag.zer0.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient

@Configuration
class SecretsManagerConfig(
    @Value("\${aws.secrets.region}") private val region: String
) {

    @Autowired
    private lateinit var credentialsProvider: AwsCredentialsProvider

    @Bean
    fun secretsManagerClient(): SecretsManagerClient {
        return SecretsManagerClient.builder()
            .region(Region.of(region))
            .credentialsProvider(credentialsProvider)
            .build()
    }
}