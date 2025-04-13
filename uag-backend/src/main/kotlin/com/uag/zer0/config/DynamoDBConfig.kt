package com.uag.zer0.config

import org.json.JSONObject
import org.slf4j.LoggerFactory
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
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest

@Configuration
@EnableDynamoDBRepositories(basePackages = ["com.uag.zer0.repository"])
class DynamoDBConfig(
    private val secretsManagerClient: SecretsManagerClient,
    @Value("\${aws.secrets.dynamodb}") private val dynamodbSecret: String,
    @Value("\${aws.secrets.dynamodb-region-key}") private val dynamodbRegionKey: String,
    @Value("\${aws.secrets.dynamodb-url-key}") private val dynamodbUrlKey: String,
) {
    @Autowired
    private lateinit var credentialsProvider: AwsCredentialsProvider

    private val logger = LoggerFactory.getLogger(DynamoDBConfig::class.java)

    private final val secretJson: JSONObject = JSONObject(secretsManagerClient.getSecretValue(
        GetSecretValueRequest.builder().secretId(dynamodbSecret).build()).secretString())
    private final val region: String = secretJson.getString(dynamodbRegionKey)
    private final val dynamodbUrl: String = secretJson.getString(dynamodbUrlKey)


    @Bean
    @Primary
    fun dynamoDbClient(): DynamoDbClient {
        return DynamoDbClient.builder()
            .region(Region.of(region))
            .endpointOverride(java.net.URI.create(dynamodbUrl))
            .credentialsProvider(credentialsProvider)
            .overrideConfiguration(
                ClientOverrideConfiguration.builder()
                    .build()
            )
            .build()
    }
}