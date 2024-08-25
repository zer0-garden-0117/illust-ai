package com.uag.zer0.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.uag.zer0.entity.work.Character
import com.uag.zer0.entity.work.Creator
import com.uag.zer0.entity.work.Tag
import com.uag.zer0.generated.endpoint.WorksApi
import com.uag.zer0.generated.model.ApiWork
import com.uag.zer0.generated.model.ApiWorkWithDetails
import com.uag.zer0.mapper.WorkMapper
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

    override fun searchWorksByTags(@RequestBody(required = false) requestBody: List<String>?): ResponseEntity<List<ApiWork>> {
        val works = requestBody?.let { workService.findWorksByTags(it) }
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun searchWorks(@RequestBody(required = false) requestBody: List<String>?): ResponseEntity<List<ApiWork>> {
        val works = requestBody?.let { workService.findWorksByFreeWords(it) }
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun getWorksById(@PathVariable("worksId") worksId: Int): ResponseEntity<ApiWorkWithDetails> {
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
        logger.info("registerWorks start!!!")
        val decodedWorksDetails = String(
            Base64.getDecoder().decode(worksDetailsBase64),
            Charsets.UTF_8
        )
        logger.info("Decoded worksDetails: $decodedWorksDetails")
        logger.info("registerWorks start2!!!")
        val objectMapper: ObjectMapper = jacksonObjectMapper().apply {
            registerModule(JavaTimeModule())
        }
        logger.info("registerWorks start3!!!")
        val apiWorkWithDetails: ApiWorkWithDetails =
            objectMapper.readValue(decodedWorksDetails)
        logger.info("apiWorksWithDetails: $apiWorkWithDetails")

        if (apiWorkWithDetails.apiWork == null) {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }
        val work = workMapper.toWork(apiWorkWithDetails.apiWork)
        val characters = mutableListOf<Character>()
        apiWorkWithDetails.apiCharacters?.forEach { apiCharacter ->
            characters.add(workMapper.toCharacter(apiCharacter))
        }
        val creators = mutableListOf<Creator>()
        apiWorkWithDetails.apiCreators?.forEach { apiCreator ->
            creators.add(workMapper.toCreator(apiCreator))
        }
        val tags = mutableListOf<Tag>()
        apiWorkWithDetails.apiTags?.forEach { apiTag ->
            tags.add(workMapper.toTag(apiTag))
        }
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
        @Valid @RequestBody apiWorkWithDetails: ApiWorkWithDetails
    ): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun deleteWorksById(@PathVariable("tagsId") tagsId: Int): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }
}