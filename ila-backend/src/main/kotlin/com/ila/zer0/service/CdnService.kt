package com.ila.zer0.service

import org.springframework.stereotype.Service

@Service
class CdnService(
    private val cdnActive: Boolean,
    private val cdnUrl: String
) {
    fun convertToCdnUrl(s3Url: String): String {
        // dev環境等は無効にしてそのまま返す
        if (!cdnActive) {
            return s3Url
        }
        // S3のURLからファイルパスを抽出
        val filePath = s3Url.substringAfterLast("/")
        // CloudFrontのURLとファイルパスを組み合わせる
        return "$cdnUrl/$filePath"
    }
}