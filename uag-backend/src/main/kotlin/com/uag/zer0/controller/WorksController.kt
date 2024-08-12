package com.uag.zer0.controller

import com.uag.zer0.generated.endpoint.WorksApi
import com.uag.zer0.generated.model.ApiWorks
import com.uag.zer0.generated.model.ApiWorksWithDetails
import jakarta.validation.Valid
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class WorksController : WorksApi {

    override fun getWorksById(@PathVariable("worksId") worksId: kotlin.Int): ResponseEntity<ApiWorksWithDetails> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun searchWorks(@RequestBody(required = false) requestBody: List<String>?): ResponseEntity<List<ApiWorks>> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun searchWorksByTags(@RequestBody(required = false) requestBody: List<String>?): ResponseEntity<List<ApiWorks>> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun registerWorks(
        @RequestPart("titleImage", required = true) titleImage: Resource,
        @RequestPart("images", required = true) images: List<Resource>,
        @RequestParam(
            value = "ApiWorksWithDetails",
            required = true
        ) apiWorksWithDetails: ApiWorksWithDetails
    ): ResponseEntity<Unit> {
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