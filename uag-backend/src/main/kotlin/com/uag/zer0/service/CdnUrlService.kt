package com.uag.zer0.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class CdnUrlService {
    @Value("\${cdn.active}")
    private lateinit var active: String

    @Value("\${cdn.url}")
    private lateinit var cloudFrontUrl: String

    fun convertToCdnUrl(s3Url: String): String {
        // dev環境等は無効にしてそのまま返す
        if (active == "invalid") {
            return s3Url
        }
        // S3のURLからファイルパスを抽出
        val filePath = s3Url.substringAfterLast("/")
        // CloudFrontのURLとファイルパスを組み合わせる
        return "$cloudFrontUrl/$filePath"
    }
}