package com.cfa.zer0.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient

@Configuration
class CognitoConfig(
    @Value("\${cognito.region:us-east-1}") private val region: String,
    @Value("\${cognito.pool-id:us-east-1_xxxxxxxxx}") private val poolId: String,
) {
    @Autowired
    private lateinit var credentialsProvider: AwsCredentialsProvider

    @Bean
    fun cognitoClient(): CognitoIdentityProviderClient {
        return CognitoIdentityProviderClient.builder()
            .region(Region.of(region))
            .credentialsProvider(credentialsProvider)
            .build()
    }

    @Bean
    fun poolId(): String {
        return poolId
    }
}