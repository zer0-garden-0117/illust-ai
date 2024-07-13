package com.uag.zer0.controller

import com.uag.zer0.generated.endpoint.WorksApi
import com.uag.zer0.generated.model.ApiWorks
import com.uag.zer0.generated.model.ApiWorksWithDetails
import com.uag.zer0.service.WorkService
import org.slf4j.LoggerFactory
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController

@RestController
class WorksController(
    private val workService: WorkService
) : WorksApi {

    private val logger = LoggerFactory.getLogger(WorksController::class.java)

    override fun registerWorks(
        authorization: String,
        titleImage: Resource,
        images: List<Resource>,
        apiWorksWithDetails: ApiWorksWithDetails,
        xCsrfToken: String?
    ): ResponseEntity<Unit> {
        logger.info("registerWorks called with: authorization=$authorization, titleImage=$titleImage, images=$images, apiWorksWithTags=$apiWorksWithDetails, xCsrfToken=$xCsrfToken")
        workService.createWork(apiWorksWithDetails)
        return ResponseEntity(HttpStatus.OK)
    }

    override fun searchWorks(
        authorization: String,
        xCsrfToken: String?,
        apiWorksWithDetails: ApiWorksWithDetails?
    ): ResponseEntity<List<ApiWorks>> {
        logger.info("searchWorks called with: authorization=$authorization, xCsrfToken=$xCsrfToken, apiWorksWithTags=$apiWorksWithDetails")
        val response = workService.searchWorks(apiWorksWithDetails)
        return ResponseEntity.ok(response)
    }

    override fun getWorksById(
        worksId: Int,
        authorization: String,
        xCsrfToken: String?
    ): ResponseEntity<ApiWorksWithDetails> {
        logger.info("getWorksById called with: pathParamWorksId=$worksId, authorization=$authorization, xCsrfToken=$xCsrfToken")
        val response = workService.getWorkWithTags(worksId.toString())
        logger.info("getWorksById found work: $response")
        return ResponseEntity.ok(response)
    }

    override fun updateWorksById(
        worksId: Int,
        authorization: String,
        apiWorksWithDetails: ApiWorksWithDetails,
        xCsrfToken: String?
    ): ResponseEntity<Unit> {
        logger.info("updateWorksById called with: pathParamWorksId=$worksId, authorization=$authorization, apiWorksWithTags=$apiWorksWithDetails, xCsrfToken=$xCsrfToken")
        workService.updateWork(worksId.toString(), apiWorksWithDetails)
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun deleteWorksById(
        tagsId: Int,
        authorization: String,
        xCsrfToken: String?
    ): ResponseEntity<Unit> {
        logger.info("deleteWorksById called with: pathParamTagsId=$tagsId, authorization=$authorization, xCsrfToken=$xCsrfToken")
        workService.deleteWork(tagsId.toString())
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }
}