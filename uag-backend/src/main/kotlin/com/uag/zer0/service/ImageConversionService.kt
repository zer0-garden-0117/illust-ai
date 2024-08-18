package com.uag.zer0.service

import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path

@Service
class ImageConversionService {
    fun convertToAvifWithStream(image: MultipartFile): ByteArray {
        try {
            val nodeScriptPath = "node-scripts/sharpConvertWithStream.js"
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

    fun convertToAvifWithFile(image: MultipartFile): ByteArray {
        val inputFile: Path = Files.createTempFile("temp-image", ".tmp")
        val outputFile: Path =
            Files.createTempFile("temp-image-converted", ".avif")
        try {
            // 一時ファイルに画像データを書き込む
            Files.write(inputFile, image.bytes)

            val nodeScriptPath = "node-scripts/sharpConvertWithFile.js"
            // Node.jsスクリプトに入力ファイルと出力ファイルのパスを渡す
            val processBuilder =
                ProcessBuilder(
                    "node",
                    nodeScriptPath,
                    inputFile.toString(),
                    outputFile.toString()
                )
            processBuilder.redirectErrorStream(true) // 標準エラーも標準出力にリダイレクト
            val process = processBuilder.start()

            // プロセスの標準出力から結果を取得
            val output = process.inputStream.bufferedReader().readText()

            // プロセスが正常に終了したか確認
            val exitCode = process.waitFor()
            if (exitCode != 0) {
                throw RuntimeException("Node.js script failed with exit code $exitCode. Output: $output")
            }

            // 変換されたAVIF画像ファイルを読み込む
            return Files.readAllBytes(outputFile)
        } catch (e: IOException) {
            throw RuntimeException(
                "Failed to convert image to AVIF: ${e.message}",
                e
            )
        } finally {
            // 一時ファイルを削除
            Files.deleteIfExists(inputFile)
            Files.deleteIfExists(outputFile)
        }
    }


    @Throws(IOException::class, InterruptedException::class)
    fun convertToAvifUsingSharp(inputFile: File, outputFile: File) {
        val scriptPath = "node-scripts/sharp-convert.js"

        // ProcessBuilderを使用してNode.jsスクリプトを実行
        val processBuilder = ProcessBuilder(
            "node",
            scriptPath,
            inputFile.absolutePath,
            outputFile.absolutePath
        )
        val process = processBuilder.start()
        process.waitFor()

        if (process.exitValue() != 0) {
            throw RuntimeException("sharp-convert.js の実行に失敗しました")
        }
    }
}