package com.uag.zer0.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.uag.zer0.dto.WorkWithDetails
import com.uag.zer0.entity.work.Character
import com.uag.zer0.entity.work.Creator
import com.uag.zer0.entity.work.Tag
import com.uag.zer0.generated.endpoint.WorksApi
import com.uag.zer0.generated.model.*
import com.uag.zer0.mapper.WorkMapper
import com.uag.zer0.service.WorkManagerService
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
class WorksController(
    private val workManagerService: WorkManagerService,
    private val workMapper: WorkMapper
) : WorksApi {

    override fun searchWorksByTags(
        @RequestBody(required = false) apiWorkSearchByTags: ApiWorkSearchByTags
    ): ResponseEntity<ApiWorksWithSearchResult> {
        val workResult = workManagerService.findWorksByTags(
            apiWorkSearchByTags.tags,
            apiWorkSearchByTags.offset,
            apiWorkSearchByTags.limit
        )
        val apiWorks = mutableListOf<ApiWork>()
        workResult?.works?.forEach { work ->
            val apiWork = workMapper.toApiWork(work)
            apiWorks.add(apiWork)
        }
        val apiWorkWithDetails = ApiWorksWithSearchResult(
            works = apiWorks,
            totalCount = workResult?.totalCount ?: 0
        )
        return ResponseEntity.ok(apiWorkWithDetails)
    }

    override fun searchWorks(
        @RequestBody(required = false) apiWorkSearch: ApiWorkSearch
    ): ResponseEntity<ApiWorksWithSearchResult> {
        val workResult = apiWorkSearch.words.let { word ->
            workManagerService.findWorksByFreeWords(
                word,
                apiWorkSearch.offset,
                apiWorkSearch.limit
            )
        }
        val apiWorks = mutableListOf<ApiWork>()
        workResult?.works?.forEach { work ->
            val apiWork = workMapper.toApiWork(work)
            apiWorks.add(apiWork)
        }
        val apiWorkWithDetails = ApiWorksWithSearchResult(
            works = apiWorks,
            totalCount = workResult?.totalCount ?: 0
        )
        return ResponseEntity.ok(apiWorkWithDetails)
    }

    override fun getWorksById(
        @PathVariable("worksId") worksId: Int
    ): ResponseEntity<ApiWorkWithDetails> {
        val workWithDetails =
            workManagerService.findWorkByWorkId(workId = worksId)
        val response = toApiWorkWithDetails(workWithDetails)
        return ResponseEntity.ok(response)
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
    ): ResponseEntity<ApiWorkWithDetails> {
        // 作品情報のデコード
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
        val work = workMapper.toWork(apiWorkWithDetails.apiWork!!)
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
        val workWithDetails = workManagerService.registerWork(
            work = work,
            characters = characters,
            creators = creators,
            tags = tags,
            titleImage = titleImage,
            images = images
        )
        val response = toApiWorkWithDetails(workWithDetails)
        return ResponseEntity.ok(response)
    }

    override fun updateWorksById(
        @PathVariable("worksId") worksId: Int,
        @Valid @RequestBody apiWorkWithDetails: ApiWorkWithDetails
    ): ResponseEntity<ApiWorkWithDetails> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun deleteWorksById(
        @PathVariable("tagsId") worksId: Int
    ): ResponseEntity<ApiWorkWithDetails> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    private fun toApiWorkWithDetails(
        workWithDetails: WorkWithDetails
    ): ApiWorkWithDetails {
        val apiWork = workMapper.toApiWork(workWithDetails.work)
        logger.info(apiWork.toString())
        val apiCharacters =
            workWithDetails.characters?.map { workMapper.toApiCharacter(it) }
                ?.toMutableList()
        logger.info(apiCharacters.toString())
        val apiCreators =
            workWithDetails.creators?.map { workMapper.toApiCreator(it) }
                ?.toMutableList()
        logger.info(apiCreators.toString())
        val apiTags = workWithDetails.tags?.map { workMapper.toApiTag(it) }
            ?.toMutableList()
        logger.info(apiTags.toString())
        val apiImgs = workWithDetails.imgs.map { workMapper.toApiImg(it) }
            .toMutableList()
        logger.info(apiImgs.toString())

        val apiWorkWithDetails = ApiWorkWithDetails(
            apiWork = apiWork,
            apiCharacters = apiCharacters,
            apiCreators = apiCreators,
            apiTags = apiTags,
            apiImgs = apiImgs
        )
        return apiWorkWithDetails
    }
}