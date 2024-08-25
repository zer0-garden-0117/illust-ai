package com.uag.zer0.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.uag.zer0.generated.endpoint.WorksApi
import com.uag.zer0.generated.model.ApiWorks
import com.uag.zer0.generated.model.ApiWorksWithDetails
import com.uag.zer0.mapper.work.WorkMapper
import com.uag.zer0.service.WorkService
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
class WorksController(
    private val workService: WorkService,
    private val workMapper: WorkMapper
) : WorksApi {

    override fun searchWorksByTags(@RequestBody(required = false) requestBody: List<String>?): ResponseEntity<List<ApiWorks>> {
        val works = requestBody?.let { workService.findWorksByTags(it) }
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun searchWorks(@RequestBody(required = false) requestBody: List<String>?): ResponseEntity<List<ApiWorks>> {
        val works = requestBody?.let { workService.findWorksByFreeWords(it) }
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun getWorksById(@PathVariable("worksId") worksId: Int): ResponseEntity<ApiWorksWithDetails> {
        val works = workService.findWorkByWorkId(workId = worksId)
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
        val objectMapper: ObjectMapper = jacksonObjectMapper().apply {
            registerModule(JavaTimeModule())
        }
        val apiWorksWithDetails: ApiWorksWithDetails =
            objectMapper.readValue(decodedWorksDetails)
        logger.info("Decoded worksDetails: $decodedWorksDetails")
        logger.info("apiWorksWithDetails: $apiWorksWithDetails")

        if (apiWorksWithDetails.apiWorks == null) {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }
        val work = workMapper.toWork(apiWorksWithDetails.apiWorks)
        val tags = mutableListOf<String>()
        apiWorksWithDetails.apiTags?.forEach { apiTag ->
            apiTag.tags?.let { tags.add(it) }
        }
        val characters = apiWorksWithDetails.apiWorks.character
        val creators = apiWorksWithDetails.apiWorks.creator
        workService.registerWork(
            work = work,
            characters = characters,
            creators = creators,
            tags = tags,
            titleImage = titleImage,
            images = images
        )
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun updateWorksById(
        @PathVariable("worksId") worksId: Int,
        @Valid @RequestBody apiWorksWithDetails: ApiWorksWithDetails
    ): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun deleteWorksById(@PathVariable("tagsId") tagsId: Int): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }
}