package com.uag.zer0.controller

import com.uag.zer0.generated.endpoint.WorksApi
import com.uag.zer0.generated.model.ApiWorks
import com.uag.zer0.generated.model.ApiWorksWithTags
import com.uag.zer0.service.WorkService
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController

@RestController
class WorksController(
    private val workService: WorkService
) : WorksApi {

    override fun registerWorks(
        authorization: String,
        titleImage: Resource,
        images: List<Resource>,
        apiWorksWithTags: ApiWorksWithTags,
        xCsrfToken: String?
    ): ResponseEntity<Unit> {
        workService.createWork(apiWorksWithTags)
        return ResponseEntity(HttpStatus.OK)
    }

    override fun searchWorks(
        authorization: String,
        xCsrfToken: String?,
        apiWorksWithTags: ApiWorksWithTags?
    ): ResponseEntity<List<ApiWorks>> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun getWorksById(
        pathParamWorksId: Int,
        authorization: String,
        xCsrfToken: String?
    ): ResponseEntity<ApiWorksWithTags> {
        workService.getWork(pathParamWorksId.toString())
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun updateWorksById(
        pathParamWorksId: Int,
        authorization: String,
        apiWorksWithTags: ApiWorksWithTags,
        xCsrfToken: String?
    ): ResponseEntity<Unit> {
        workService.updateWork(pathParamWorksId.toString(), apiWorksWithTags)
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun deleteWorksById(
        pathParamTagsId: Int,
        authorization: String,
        xCsrfToken: String?
    ): ResponseEntity<Unit> {
        workService.deleteWork(pathParamTagsId.toString())
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }
}