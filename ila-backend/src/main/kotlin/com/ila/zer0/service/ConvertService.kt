package com.ila.zer0.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import java.io.IOException
import java.net.URI

@Service
class ConvertService(
    private val nodeJsPath: String,
    private val s3Client: S3Client
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    fun toPng(image: MultipartFile): ByteArray {
        val nodeScriptPath = "$nodeJsPath/service/convert/resize/resize.js"
        return executeNodeScript(image, nodeScriptPath)
    }

    fun resize(s3Url: String): ByteArray {
        logger.info("Starting image resize for URL: $s3Url")

        try {
            // S3 URLからバケット名とオブジェクトキーを抽出
            logger.debug("Parsing S3 URL")
            val (bucket, key) = parseS3Url(s3Url)
            logger.debug("Parsed bucket: $bucket, key: $key")

            // S3から画像をダウンロード
            logger.debug("Downloading image from S3")
            val imageBytes = downloadFromS3(bucket, key)
            logger.debug("Downloaded image size: ${imageBytes.size} bytes")

            val nodeScriptPath = "$nodeJsPath/service/convert/resize/resize.js"
            logger.debug("Executing Node.js script: $nodeScriptPath")

            val result = executeNodeScript(imageBytes, nodeScriptPath)
            logger.info("Image resize completed successfully. Result size: ${result.size} bytes")

            return result
        } catch (e: Exception) {
            logger.error("Failed to resize image", e)
            throw e
        }
    }

    private fun downloadFromS3(bucket: String, key: String): ByteArray {
        logger.debug("Downloading from S3 - bucket: $bucket, key: $key")
        val getObjectRequest = GetObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .build()

        return try {
            val result = s3Client.getObjectAsBytes(getObjectRequest).asByteArray()
            logger.debug("Successfully downloaded from S3. Size: ${result.size} bytes")
            result
        } catch (e: Exception) {
            logger.error("Failed to download from S3", e)
            throw e
        }
    }

    private fun parseS3Url(s3Url: String): Pair<String, String> {
        logger.debug("Parsing S3 URL: $s3Url")
        return try {
            val uri = URI.create(s3Url)
            if (uri.scheme != "s3") {
                throw IllegalArgumentException("Invalid S3 URL: $s3Url")
            }

            val bucket = uri.host
            val key = uri.path.removePrefix("/")
            Pair(bucket, key)
        } catch (e: Exception) {
            logger.error("Failed to parse S3 URL", e)
            throw e
        }
    }

    private fun executeNodeScript(imageBytes: ByteArray, scriptPath: String, vararg args: String): ByteArray {
        logger.debug("Executing Node.js script. Input size: ${imageBytes.size} bytes")
        var process: Process? = null
        try {
            val command = mutableListOf("node", scriptPath)
            command.addAll(args)
            logger.debug("Command: ${command.joinToString(" ")}")

            val processBuilder = ProcessBuilder(command)
            process = processBuilder.start()

            // 画像データを標準入力に送信
            process.outputStream.use { outputStream ->
                logger.debug("Writing image data to process input")
                outputStream.write(imageBytes)
                outputStream.flush()
                logger.debug("Finished writing image data")
            }

            // 変換された画像を標準出力から受信
            logger.debug("Reading converted image from process output")
            val convertedImage = process.inputStream.readBytes()
            logger.debug("Read converted image size: ${convertedImage.size} bytes")

            // プロセスが正常に終了したか確認
            val exitCode = process.waitFor()
            logger.debug("Process exited with code: $exitCode")

            if (exitCode != 0) {
                val errorOutput = process.errorStream.bufferedReader().use { it.readText() }
                logger.error("Node.js script failed. Exit code: $exitCode, Error: $errorOutput")
                throw RuntimeException("Node.js script failed with exit code $exitCode. Error: $errorOutput")
            }

            return convertedImage
        } catch (e: IOException) {
            logger.error("IO error during Node.js script execution", e)
            throw RuntimeException("Failed to convert image: ${e.message}", e)
        } catch (e: InterruptedException) {
            logger.error("Process interrupted during execution", e)
            throw RuntimeException("Image conversion interrupted", e)
        } finally {
            // プロセスがまだ動いている場合は終了させる
            process?.let {
                logger.debug("Destroying process")
                it.destroy()
                if (it.isAlive) {
                    it.destroyForcibly()
                }
            }
        }
    }

    private fun executeNodeScript(image: MultipartFile, scriptPath: String, vararg args: String): ByteArray {
        var process: Process? = null
        try {
            val command = mutableListOf("node", scriptPath)
            command.addAll(args)
            val processBuilder = ProcessBuilder(command)
            process = processBuilder.start()

            // 画像データを標準入力に送信
            process.outputStream.use { outputStream ->
                outputStream.write(image.bytes)
                outputStream.flush()
            }

            // 変換された画像を標準出力から受信
            val convertedImage = process.inputStream.readBytes()

            // プロセスが正常に終了したか確認
            val exitCode = process.waitFor()
            if (exitCode != 0) {
                throw RuntimeException("Node.js script failed with exit code $exitCode")
            }

            return convertedImage
        } catch (e: IOException) {
            throw RuntimeException(
                "Failed to convert image: ${e.message}",
                e
            )
        } finally {
            // プロセスがまだ動いている場合は終了させる
            process?.destroy()
        }
    }

}