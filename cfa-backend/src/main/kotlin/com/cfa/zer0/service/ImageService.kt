package com.cfa.zer0.service

import org.springframework.stereotype.Service
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest
import software.amazon.awssdk.core.SdkBytes
import software.amazon.awssdk.services.bedrockruntime.model.BedrockRuntimeException

@Service
class ImageService(
    private val bedrockRuntimeClient: BedrockRuntimeClient
) {

    fun createImage(prompt: String): ByteArray {
        val requestBody = """
        {
            "text_prompts": [
                {
                    "text": "$prompt",
                    "weight": 1.0
                }
            ],
            "cfg_scale": 7,
            "seed": ${(0..100000).random()},
            "steps": 50,
            "width": 512,
            "height": 512
        }
        """.trimIndent()

        try {
            // Stable Diffusion XL用のモデルID
            val modelId = "stability.stable-diffusion-xl-v1"

            val request = InvokeModelRequest.builder()
                .modelId(modelId)
                .contentType("application/json")
                .accept("image/png")
                .body(SdkBytes.fromUtf8String(requestBody))
                .build()

            val response = bedrockRuntimeClient.invokeModel(request)

            // レスポンスから直接バイト配列を取得
            return response.body().asByteArray()

        } catch (e: BedrockRuntimeException) {
            throw RuntimeException("Failed to generate image: ${e.message}", e)
        }
    }
}