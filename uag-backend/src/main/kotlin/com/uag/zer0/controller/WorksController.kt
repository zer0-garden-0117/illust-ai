package com.uag.zer0.controller

import com.uag.zer0.generated.endpoint.WorksApi
import com.uag.zer0.generated.model.ApiWorks
import com.uag.zer0.generated.model.ApiWorksWithDetails
import com.uag.zer0.service.ImageConversionService
import com.uag.zer0.service.ImageUploadService
import com.uag.zer0.service.work.WorkService
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

@RestController
class WorksController(
    private val workService: WorkService,
    private val imageConversionService: ImageConversionService,
    private val imageUploadService: ImageUploadService
) : WorksApi {

    override fun searchWorksByTags(@RequestBody(required = false) requestBody: List<String>?): ResponseEntity<List<ApiWorks>> {
        val works = requestBody?.let { workService.findWorksByTagWords(it) }
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun searchWorks(@RequestBody(required = false) requestBody: List<String>?): ResponseEntity<List<ApiWorks>> {
        val works = requestBody?.let { workService.findWorksByFreeWords(it) }
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun getWorksById(@PathVariable("worksId") worksId: kotlin.Int): ResponseEntity<ApiWorksWithDetails> {
        val works = workService.findWorkByWorkId(workId = worksId.toString())
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    private val logger = LoggerFactory.getLogger(WorksController::class.java)

    @PostMapping(
        "/works",
        consumes = ["multipart/form-data"],
        produces = ["application/json"]
    )
    override fun registerWorks(
        @RequestPart("titleImage", required = true) titleImage: MultipartFile,
        @RequestPart("images", required = true) images: List<MultipartFile>,
        @RequestParam(
            value = "worksDetailsBase64",
            required = true
        ) worksDetailsBase64: String
    ): ResponseEntity<Unit> {
        val decodedWorksDetails = String(
            Base64.getDecoder().decode(worksDetailsBase64),
            Charsets.UTF_8
        )
        logger.info("Decoded worksDetails: $decodedWorksDetails")
        val formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")
        val titleImageAvif =
            imageConversionService.convertToAvifWithStream(titleImage)
        val titleTimestamp = LocalDateTime.now().format(formatter)
        val titleImageUrl = imageUploadService.uploadToS3(
            titleImageAvif,
            "titleImage_$titleTimestamp.avif"
        )

        val imageUrls = images.map { image ->
            val avifImage =
                imageConversionService.convertToAvifWithStream(image)
            val imageTimestamp = LocalDateTime.now().format(formatter)
            val imageName = "workImage_$imageTimestamp.avif"
            imageUploadService.uploadToS3(avifImage, imageName)
        }

        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun updateWorksById(
        @PathVariable("worksId") worksId: kotlin.Int,
        @Valid @RequestBody apiWorksWithDetails: ApiWorksWithDetails
    ): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun deleteWorksById(@PathVariable("tagsId") tagsId: kotlin.Int): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }
}