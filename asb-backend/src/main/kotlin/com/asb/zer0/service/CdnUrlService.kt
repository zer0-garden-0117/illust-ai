package com.asb.zer0.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class CdnUrlService(
    @Value("\${aws.cdn.active:false}") private var isActive: Boolean = false,
    @Value("\${aws.cdn.url}") private var cloudFrontUrl: String
) {
    fun convertToCdnUrl(s3Url: String): String {
        // dev環境等は無効にしてそのまま返す
        if (!isActive) {
            return s3Url
        }
        // S3のURLからファイルパスを抽出
        val filePath = s3Url.substringAfterLast("/")
        // CloudFrontのURLとファイルパスを組み合わせる
        return "$cloudFrontUrl/$filePath"
    }
}