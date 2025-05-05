package com.asb.zer0.service

import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.IOException

@Service
class ConvertService(
    private val nodeJsPath: String
) {

    fun toAvif(image: MultipartFile): ByteArray {
        val nodeScriptPath = "$nodeJsPath/service/convert/avif/toAvif.js"
        return executeNodeScript(image, nodeScriptPath)
    }

    fun toThumbnail(image: MultipartFile): ByteArray {
        val nodeScriptPath = "$nodeJsPath/service/convert/thumbnail/toThumbnail.js"
        return executeNodeScript(image, nodeScriptPath)
    }

    fun toWatermask(image: MultipartFile): ByteArray {
        val nodeScriptPath = "$nodeJsPath/service/convert/watermask/toWatermask.js"
        val watermaskPath = "$nodeJsPath/service/convert/common/watermask.png"
        return executeNodeScript(image, nodeScriptPath, watermaskPath)
    }

    fun toJpeg(image: MultipartFile): ByteArray {
        val nodeScriptPath = "$nodeJsPath/service/convert/jpeg/toJpeg.js"
        return executeNodeScript(image, nodeScriptPath)
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