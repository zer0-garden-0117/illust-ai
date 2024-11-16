package com.uag.zer0.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.IOException

@Service
class ConvertService {
    @Value("\${node.path}")
    private lateinit var nodePath: String

    fun toAvif(image: MultipartFile): ByteArray {

        var process: Process? = null
        try {
            val nodeScriptPath =
                nodePath + "service/convert/avif/toAvif.js"
            val processBuilder = ProcessBuilder("node", nodeScriptPath)
            process = processBuilder.start()

            // 画像データを標準入力に送信
            process.outputStream.use { outputStream ->
                outputStream.write(image.bytes)
                outputStream.flush()
            }

            // AVIF画像を標準出力から受信
            val avifImage = process.inputStream.readBytes()

            // プロセスが正常に終了したか確認
            val exitCode = process.waitFor()
            if (exitCode != 0) {
                throw RuntimeException("Node.js script failed with exit code $exitCode")
            }

            return avifImage
        } catch (e: IOException) {
            throw RuntimeException(
                "Failed to convert image to AVIF: ${e.message}",
                e
            )
        } finally {
            // プロセスがまだ動いている場合は終了させる
            process?.destroy()
        }
    }

    fun toThumbnail(image: MultipartFile): ByteArray {
        try {
            val nodeScriptPath =
                nodePath + "service/convert/thumbnail/toThumbnail.js"
            val processBuilder = ProcessBuilder("node", nodeScriptPath)
            val process = processBuilder.start()

            // 画像データを標準入力に送信
            process.outputStream.use { outputStream ->
                outputStream.write(image.bytes)
                outputStream.flush()
            }

            // AVIF画像を標準出力から受信
            val avifImage = process.inputStream.readBytes()

            // プロセスが正常に終了したか確認
            val exitCode = process.waitFor()
            if (exitCode != 0) {
                throw RuntimeException("Node.js script failed with exit code $exitCode")
            }

            return avifImage
        } catch (e: IOException) {
            throw RuntimeException(
                "Failed to convert image to AVIF: ${e.message}",
                e
            )
        }
    }

    fun toWatermask(image: MultipartFile): ByteArray {
        try {
            val nodeScriptPath =
                nodePath + "service/convert/watermask/toWatermask.js"
            val watermaskPath =
                nodePath + "service/convert/common/watermask.png"
            val processBuilder =
                ProcessBuilder("node", nodeScriptPath, watermaskPath)
            val process = processBuilder.start()

            // 画像データを標準入力に送信
            process.outputStream.use { outputStream ->
                outputStream.write(image.bytes)
                outputStream.flush()
            }

            // AVIF画像を標準出力から受信
            val avifImage = process.inputStream.readBytes()

            // プロセスが正常に終了したか確認
            val exitCode = process.waitFor()
            if (exitCode != 0) {
                throw RuntimeException("Node.js script failed with exit code $exitCode")
            }

            return avifImage
        } catch (e: IOException) {
            throw RuntimeException(
                "Failed to convert image to AVIF: ${e.message}",
                e
            )
        }
    }
}