package com.ila.zer0.service

import com.aventrix.jnanoid.jnanoid.NanoIdUtils
import org.springframework.stereotype.Service

@Service
class UuidService {
    /**
     * NanoIDを使用して8文字のユニークIDを生成する
     * 文字セット: 英大小文字、数字
     */
    fun generateUuid(): String {
        val customAlphabet =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        return NanoIdUtils.randomNanoId(
            NanoIdUtils.DEFAULT_NUMBER_GENERATOR,
            customAlphabet.toCharArray(),
            8
        )
    }
}