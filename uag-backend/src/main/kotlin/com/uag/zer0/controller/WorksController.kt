package com.uag.zer0.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.uag.zer0.config.CustomAuthenticationToken
import com.uag.zer0.dto.WorkWithTag
import com.uag.zer0.generated.endpoint.WorksApi
import com.uag.zer0.generated.model.ApiWork
import com.uag.zer0.generated.model.ApiWorkSearchByTags
import com.uag.zer0.generated.model.ApiWorkWithTag
import com.uag.zer0.generated.model.ApiWorksWithSearchResult
import com.uag.zer0.mapper.TagMapper
import com.uag.zer0.mapper.WorkMapper
import com.uag.zer0.service.user.UserManagerService
import com.uag.zer0.service.work.WorkManagerService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
class WorksController(
    private val workManagerService: WorkManagerService,
    private val workMapper: WorkMapper,
    private val tagMapper: TagMapper,
    private val userManagerService: UserManagerService
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

    override fun getWorksById(
        @PathVariable("workId") workId: String
    ): ResponseEntity<ApiWorkWithTag> {
        val workWithTag = workManagerService.findWorkById(workId = workId)
        val response = toApiWorkWithTag(workWithTag)
        return ResponseEntity.ok(response)
    }

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
    ): ResponseEntity<ApiWorkWithTag> {
        // roleを取得してadminじゃなければ401を返す
        val authentication = SecurityContextHolder.getContext().authentication
        if (authentication !is CustomAuthenticationToken || authentication.role != "admin") {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }

        // 作品情報のデコード
        val decodedWorksDetails = String(
            Base64.getDecoder().decode(worksDetailsBase64),
            Charsets.UTF_8
        )
        val objectMapper: ObjectMapper = jacksonObjectMapper().apply {
            registerModule(JavaTimeModule())
        }
        val apiWorkWithTag: ApiWorkWithTag =
            objectMapper.readValue(decodedWorksDetails)
        if (apiWorkWithTag.apiWork == null) {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }

        // ApiのモデルをDomainのモデルに変換
        val work = workMapper.toWork(apiWorkWithTag.apiWork!!)
        val tags = tagMapper.toTag(apiWorkWithTag.apiTags!!)

        // 作品の登録
        val workWithDetails = workManagerService.registerWork(
            work = work,
            tags = tags,
            titleImage = titleImage,
            images = images
        )

        // DomainのモデルをApiのモデルに変換
        val response = toApiWorkWithTag(workWithDetails)
        return ResponseEntity.ok(response)
    }

    override fun updateWorksById(
        @PathVariable("workId") workId: String,
        @Valid @RequestBody apiWorkWithTag: ApiWorkWithTag
    ): ResponseEntity<ApiWorkWithTag> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun deleteWorksById(
        @PathVariable("workId") workId: String
    ): ResponseEntity<ApiWorkWithTag> {
        // 作品の削除
        val workWithTag = workManagerService.deleteWorkById(workId)
        // ユーザーの情報からも削除
        userManagerService.deleteWorkId(workId)

        // DomainのモデルをApiのモデルに変換
        val response = toApiWorkWithTag(workWithTag)
        return ResponseEntity.ok(response)
    }

    private fun toApiWorkWithTag(
        workWithTag: WorkWithTag
    ): ApiWorkWithTag {
        val apiWork = workMapper.toApiWork(workWithTag.work)
        val apiTags = tagMapper.toApiTag(workWithTag.tags)
        val apiWorkWithTag = ApiWorkWithTag(
            apiWork = apiWork,
            apiTags = apiTags
        )
        return apiWorkWithTag
    }
}