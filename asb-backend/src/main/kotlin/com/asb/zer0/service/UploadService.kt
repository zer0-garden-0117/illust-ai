package com.asb.zer0.service

import org.json.JSONObject
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import software.amazon.awssdk.awscore.exception.AwsServiceException
import software.amazon.awssdk.core.exception.SdkClientException
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest

@Service
class UploadService(
    private val s3Client: S3Client,
    private val secretsManagerClient: SecretsManagerClient,
    @Value("\${aws.secrets.s3}") private val s3Secret: String,
    @Value("\${aws.secrets.s3-bucket-key}") private val s3BucketKey: String,
) {
    private final val secretJson: JSONObject = JSONObject(secretsManagerClient.getSecretValue(
        GetSecretValueRequest.builder().secretId(s3Secret).build()).secretString())
    private final val bucketName: String = secretJson.getString(s3BucketKey)

    fun uploadToS3(image: ByteArray, fileName: String): String {
        val requestBody = RequestBody.fromBytes(image)

        // PutObjectRequestのビルド
        val putObjectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(fileName)
            .contentType("image/avif")
            .build()

        try {
            // S3にオブジェクトをアップロード
            s3Client.putObject(putObjectRequest, requestBody)

            // アップロードされたオブジェクトのURLを生成して返す
            return s3Client.utilities().getUrl { b ->
                b.bucket(bucketName).key(fileName)
            }.toString()

        } catch (e: AwsServiceException) {
            throw RuntimeException("Failed to upload file to S3", e)
        } catch (e: SdkClientException) {
            throw RuntimeException("Failed to connect to S3", e)
        }
    }
}