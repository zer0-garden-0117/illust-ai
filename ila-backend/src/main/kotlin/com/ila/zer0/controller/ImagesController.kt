package com.ila.zer0.controller

import com.ila.zer0.generated.endpoint.ImagesApi
import com.ila.zer0.generated.model.*
import com.ila.zer0.service.ImageService
import com.ila.zer0.service.S3Service
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class ImagesController(
    private val imageService: ImageService,
    private val s3Service: S3Service
) : ImagesApi {

    override fun createImages(
        @RequestBody apiImages: ApiImages
    ): ResponseEntity<ApiImages> {
        val imageData = imageService.createImage(apiImages.prompt!!)
        val imageUrl = s3Service.uploadToS3(
            imageData,
            fileName = "test.png",
            contentType = "image/png"
        )
        val result = ApiImages(
            prompt = apiImages.prompt,
            imageUrl = imageUrl
        )
        return ResponseEntity.ok(result)
    }
}