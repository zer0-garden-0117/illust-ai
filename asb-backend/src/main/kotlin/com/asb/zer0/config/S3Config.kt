package com.asb.zer0.config

import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import org.springframework.beans.factory.annotation.Value
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest

@Configuration
class S3Config(
    private val secretsManagerClient: SecretsManagerClient,
    @Value("\${aws.secrets.s3}") private val s3Secret: String,
    @Value("\${aws.secrets.s3-region-key}") private val s3RegionKey: String,
) {
    @Autowired
    private lateinit var credentialsProvider: AwsCredentialsProvider

    private final val secretJson: JSONObject = JSONObject(secretsManagerClient.getSecretValue(
        GetSecretValueRequest.builder().secretId(s3Secret).build()).secretString())
    private final val region: String = secretJson.getString(s3RegionKey)

    @Bean
    fun s3Client(): S3Client {
        return S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(credentialsProvider)
            .build()
    }
}