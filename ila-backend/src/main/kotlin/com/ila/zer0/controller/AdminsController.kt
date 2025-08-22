package com.ila.zer0.controller

import com.ila.zer0.generated.endpoint.AdminsApi
import com.ila.zer0.generated.model.ApiWorkImage
import com.ila.zer0.generated.model.ApiWorkWithTag
import com.ila.zer0.mapper.TagMapper
import com.ila.zer0.mapper.WorkMapper
import com.ila.zer0.service.work.WorkManagerService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestBody

class AdminsController(
    private val workManagerService: WorkManagerService,
    private val workMapper: WorkMapper,
    private val tagMapper: TagMapper,
): AdminsApi {

    override fun patchWorksImagesById(
        @Valid @RequestBody apiWorkImage: ApiWorkImage
    ): ResponseEntity<ApiWorkWithTag> {
        // workを取得してURLを更新
        val workWithTag = workManagerService.findWorkById(workId = apiWorkImage.workId!!)
        workWithTag.work.titleImgUrl = apiWorkImage.titleImgUrl!!
        workWithTag.work.thumbnailImgUrl = apiWorkImage.thumbnailImgUrl!!

        // 作品更新
        workManagerService.updateWork(workWithTag.work)

        // APIモデルに変換して返却
        return ResponseEntity.ok(toApiWorkWithTag(workWithTag))
    }

    private fun toApiWorkWithTag(
        workWithTag: com.ila.zer0.dto.WorkWithTag
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