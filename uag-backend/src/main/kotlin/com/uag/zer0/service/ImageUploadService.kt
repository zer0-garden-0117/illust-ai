package com.uag.zer0.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import software.amazon.awssdk.awscore.exception.AwsServiceException
import software.amazon.awssdk.core.exception.SdkClientException
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.PutObjectRequest

@Service
class ImageUploadService(
    private val s3Client: S3Client,
) {
    @Value("\${cloud.aws.s3.bucket}")
    private val bucketName: String? = null

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