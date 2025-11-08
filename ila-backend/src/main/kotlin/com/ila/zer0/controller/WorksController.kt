package com.ila.zer0.controller

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.entity.User
import com.ila.zer0.generated.endpoint.WorksApi
import com.ila.zer0.generated.model.*
import com.ila.zer0.mapper.TagMapper
import com.ila.zer0.mapper.WorkMapper
import com.ila.zer0.service.user.UsageService
import com.ila.zer0.service.user.UserManagerService
import com.ila.zer0.service.work.WorkManagerService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
class WorksController(
    private val workManagerService: WorkManagerService,
    private val workMapper: WorkMapper,
    private val tagMapper: TagMapper,
    private val userManagerService: UserManagerService,
) : WorksApi {

    override fun getPublicWorksByFilter(
        @RequestParam(value = "offset", required = true) offset: Int,
        @RequestParam(value = "limit", required = true) limit: Int,
        @RequestParam(value = "worksFilterType", required = true) worksFilterType: String
    ): ResponseEntity<ApiWorks> {
        if (worksFilterType != "new" && worksFilterType != "theme") {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }

        val workResult = if (worksFilterType == "new") {
            workManagerService.findWorksByTags(listOf("GLOBAL"), offset, limit)
        } else {
            workManagerService.findWorksByTags(listOf("theme"), offset, limit)
        }

        // APIモデルに変換
        val apiWorksWithTags = mutableListOf<ApiWorkWithTag>()
        workResult?.works?.forEach { work ->
            val apiWork = workMapper.toApiWork(work)
            val apiWorkWithTag = ApiWorkWithTag(apiWork = apiWork, apiTags = null)
            apiWorksWithTags.add(apiWorkWithTag)
        }
        val apiWorks = ApiWorks(apiWorksWithTags, workResult?.totalCount ?: 0)
        return ResponseEntity.ok(apiWorks)
    }

    override fun getPublicWorksById(
        @PathVariable("workId") workId: String
    ): ResponseEntity<ApiWorkWithTag> {
        val workWithTag = workManagerService.findWorkById(workId = workId)

        // statusがpostedでない場合はエラーを返す
        if (workWithTag.work.status != "posted") {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }

        // 表示用のユーザー情報、いいね数を取得
        val workUser = userManagerService.getUserByIdForWork(workWithTag.work.userId)
            ?: return ResponseEntity(HttpStatus.BAD_REQUEST)
        workWithTag.work.userName = workUser.userName
        workWithTag.work.customUserId = workUser.customUserId
        workWithTag.work.profileImageUrl = workUser.profileImageUrl
        workWithTag.work.likes = workManagerService.getLikes(workWithTag.work.workId)
        // APIモデルに変換して返却
        val response = toApiWorkWithTag(workWithTag)
        return ResponseEntity.ok(response)
    }

    override fun getPublicWorksTags(
        @PathVariable("tag") tag: String,
        @RequestParam(value = "offset", required = true) offset: Int,
        @RequestParam(value = "limit", required = true) limit: Int
    ): ResponseEntity<ApiWorks> {
        // 作品検索
        val workResult = workManagerService.findWorksByTags(listOf(tag), offset, limit)

        // APIモデルに変換
        val apiWorksWithTags = mutableListOf<ApiWorkWithTag>()
        workResult?.works?.forEach { work ->
            val apiWork = workMapper.toApiWork(work)
            val apiWorkWithTag = ApiWorkWithTag(apiWork = apiWork, apiTags = null)
            apiWorksWithTags.add(apiWorkWithTag)
        }
        val apiWorks = ApiWorks(apiWorksWithTags, workResult?.totalCount ?: 0)
        return ResponseEntity.ok(apiWorks)
    }

    override fun getWorksByFilter(
        @RequestParam(value = "offset", required = true) offset: Int,
        @RequestParam(value = "limit", required = true) limit: Int,
        @RequestParam(value = "worksFilterType", required = true) worksFilterType: String
    ): ResponseEntity<ApiWorks> {
        if (worksFilterType != "followUserPosted" && worksFilterType != "theme") {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }
        // ユーザーを取得
        val user = getUser() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        val workResult = workManagerService.getFollowUserWorks(user.userId, offset, limit)
        // APIモデルに変換
        val apiWorksWithTags = mutableListOf<ApiWorkWithTag>()
        workResult.works.forEach { work ->
            val apiWork = workMapper.toApiWork(work)
            val apiWorkWithTag = ApiWorkWithTag(apiWork = apiWork, apiTags = null)
            apiWorksWithTags.add(apiWorkWithTag)
        }
        val apiWorks = ApiWorks(apiWorksWithTags, workResult.totalCount)
        return ResponseEntity.ok(apiWorks)
    }

    override fun getWorksById(
        @PathVariable("workId") workId: String
    ): ResponseEntity<ApiWorkWithTag> {
        val workWithTag = workManagerService.findWorkById(workId = workId)
        val user = getUser() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        workWithTag.work.isMine = (user.userId == workWithTag.work.userId)

        // statusがpostedでない場合はエラーを返す
        if (workWithTag.work.status != "posted") {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }

        // 表示用のユーザー情報、いいね数を取得
        val workUser = userManagerService.getUserByIdForWork(workWithTag.work.userId)
            ?: return ResponseEntity(HttpStatus.BAD_REQUEST)
        workWithTag.work.userName = workUser.userName
        workWithTag.work.customUserId = workUser.customUserId
        workWithTag.work.profileImageUrl = workUser.profileImageUrl
        val likesCountAndIsLiked = workManagerService.getLikesCountAndIsLikedByWorkId(workWithTag.work.workId, user.userId)
        workWithTag.work.likes = likesCountAndIsLiked.likesCount
        workWithTag.work.isLiked = likesCountAndIsLiked.isLiked

        // APIモデルに変換して返却
        val response = toApiWorkWithTag(workWithTag)
        return ResponseEntity.ok(response)
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

    private fun getUser(): User? {
        val authentication: Authentication? =
            SecurityContextHolder.getContext().authentication
        val customAuth = authentication as? CustomAuthenticationToken
        if (customAuth?.userId == null) {
            return null
        }
        return userManagerService.getUserById(customAuth.userId)
    }
}