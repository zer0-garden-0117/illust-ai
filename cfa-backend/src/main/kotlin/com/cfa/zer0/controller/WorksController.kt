package com.cfa.zer0.controller

import com.cfa.zer0.entity.Tag
import com.cfa.zer0.entity.Work
import com.cfa.zer0.generated.endpoint.WorksApi
import com.cfa.zer0.generated.model.*
import com.cfa.zer0.mapper.TagMapper
import com.cfa.zer0.mapper.WorkMapper
import com.cfa.zer0.service.user.UserManagerService
import com.cfa.zer0.service.work.WorkManagerService
import io.swagger.v3.oas.annotations.Parameter
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class WorksController(
    private val workManagerService: WorkManagerService,
    private val workMapper: WorkMapper,
    private val tagMapper: TagMapper,
    private val userManagerService: UserManagerService
) : WorksApi {

    override fun createWorks(
        @RequestBody apiWorkWithTag: ApiWorkWithTag
    ): ResponseEntity<ApiWorkWithTag> {
        // ドメインモデルに変換
        val work: Work = workMapper.toWork(apiWorkWithTag.apiWork!!)
        val tags: List<Tag> = tagMapper.toTag(apiWorkWithTag.apiTags!!)

        // 作品作成
        val workWithTag = workManagerService.createWork(work, tags)

        // APIモデルに変換して返却
        return ResponseEntity.ok(toApiWorkWithTag(workWithTag))
    }

    override fun patchWorksImagesById(
        @PathVariable("workId") workId: kotlin.String,
        @Valid @RequestBody apiWorkImage: ApiWorkImage
    ): ResponseEntity<ApiWorkWithTag> {
        // workを取得してURLを更新
        val workWithTag = workManagerService.findWorkById(workId = workId)
        workWithTag.work.titleImgUrl = apiWorkImage.titleImgUrl!!
        workWithTag.work.thumbnailImgUrl = apiWorkImage.thumbnailImgUrl!!

        // 作品更新
        workManagerService.updateWork(workWithTag.work)

        // APIモデルに変換して返却
        return ResponseEntity.ok(toApiWorkWithTag(workWithTag))
    }

    override fun patchWorksMetaDatasById(
        @PathVariable("workId") workId: String,
        @Valid @RequestBody apiWorkMetaData: ApiWorkMetaData
    ): ResponseEntity<ApiWorkWithTag> {
        // workを取得してメタデータを更新
        val workWithTag = workManagerService.findWorkById(workId = workId)
        workWithTag.work.mainTitle = apiWorkMetaData.mainTitle!!
        workWithTag.work.subTitle = apiWorkMetaData.subTitle!!
        workWithTag.work.description = apiWorkMetaData.description!!
        workWithTag.work.status = apiWorkMetaData.status!!

        // 作品更新
        workManagerService.updateWork(workWithTag.work)

        // APIモデルに変換して返却
        return ResponseEntity.ok(toApiWorkWithTag(workWithTag))
    }


    override fun getWorksById(
        @PathVariable("workId") workId: String
    ): ResponseEntity<ApiWorkWithTag> {
        val workWithTag = workManagerService.findWorkById(workId = workId)
        val response = toApiWorkWithTag(workWithTag)
        return ResponseEntity.ok(response)
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

    override fun searchWorksByTags(
        @RequestBody(required = false) apiWorkSearchByTags: ApiWorkSearchByTags
    ): ResponseEntity<ApiWorksWithSearchResult> {
        // 作品検索
        val workResult = workManagerService.findWorksByTags(
            apiWorkSearchByTags.tags,
            apiWorkSearchByTags.offset,
            apiWorkSearchByTags.limit
        )

        // APIモデルに変換
        val apiWorks = mutableListOf<ApiWork>()
        workResult?.works?.forEach { work ->
            val apiWork = workMapper.toApiWork(work)
            apiWorks.add(apiWork)
        }
        val apiWorkWithDetails = ApiWorksWithSearchResult(apiWorks, workResult?.totalCount ?: 0)
        return ResponseEntity.ok(apiWorkWithDetails)
    }


    private fun toApiWorkWithTag(
        workWithTag: com.cfa.zer0.dto.WorkWithTag
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