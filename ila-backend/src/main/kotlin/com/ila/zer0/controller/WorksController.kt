package com.ila.zer0.controller

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.dto.WorkWithTag
import com.ila.zer0.entity.Tag
import com.ila.zer0.entity.User
import com.ila.zer0.entity.Work
import com.ila.zer0.generated.endpoint.WorksApi
import com.ila.zer0.generated.model.*
import com.ila.zer0.mapper.TagMapper
import com.ila.zer0.mapper.WorkMapper
import com.ila.zer0.service.user.UsageService
import com.ila.zer0.service.user.UserManagerService
import com.ila.zer0.service.work.WorkManagerService
import io.swagger.v3.oas.annotations.Parameter
import jakarta.validation.Valid
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
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
    private val usageService: UsageService
) : WorksApi {

    override fun createWorks(
        @RequestBody apiWork: ApiWork
    ): ResponseEntity<ApiWorkWithTag> {
        // バリデーション
        if (apiWork.prompt.isNullOrEmpty() || apiWork.model.isNullOrEmpty()) {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }

        // ユーザーを取得
        val user = getUser() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        // 生成可能数をチェック
        if (usageService.getRemainingToday(user.userId, defaultLimit = user.illustNumLimit) <= 0) {
            return ResponseEntity(HttpStatus.PAYMENT_REQUIRED)
        }
        // プランによってttlとsupportToに設定する日数を設定
        val days = if (user.plan == "Basic") 30 else 7
        // ttlにはunix epoch millisで設定
        val tll = System.currentTimeMillis() + days * 24 * 60 * 60 * 1000L
        // expiredAtには今日の日付からdaysを足した日付をInstant形式で設定
        val supportToDays = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"))
            .plusDays(days.toLong())
            .toInstant()

        val work = Work().apply {
            userId = user.userId
            prompt = apiWork.prompt!!
            negativePrompt = apiWork.negativePrompt!!
            model = apiWork.model!!
            expiredAt = supportToDays
            ttl = tll
        }

        // 作品作成
        val creatingWork = workManagerService.createWork(work)

        // イラスト生成数をデクリメント
        usageService.consumeOneToday(user.userId, limitIfAbsent = user.illustNumLimit)

        val workWithTag = WorkWithTag(
            work = work,
            tags = emptyList()
        )

        // APIモデルに変換して返却
        return ResponseEntity.ok(toApiWorkWithTag(workWithTag))
    }

    override fun getWorksById(
        @PathVariable("workId") workId: String
    ): ResponseEntity<ApiWorkWithTag> {
        val workWithTag = workManagerService.findWorkById(workId = workId)
        workWithTag.work.isMine = (getUser()?.userId == workWithTag.work.userId)

        // statusがpostedの場合、表示用のユーザー情報、いいね数を取得
        if (workWithTag.work.status == "posted") {
            val user = userManagerService.getUserByIdForWork(workWithTag.work.userId)
                ?: return ResponseEntity(HttpStatus.BAD_REQUEST)
            workWithTag.work.userName = user.userName
            workWithTag.work.customUserId = user.customUserId
            workWithTag.work.profileImageUrl = user.profileImageUrl
            workWithTag.work.likes = workManagerService.getLikesCountByWorkId(workWithTag.work.workId)
        }
        val response = toApiWorkWithTag(workWithTag)
        return ResponseEntity.ok(response)
    }

    override fun updatedWorksById(
        @PathVariable("workId") workId: String,
        @Valid @RequestBody apiWork: ApiWork
    ): ResponseEntity<ApiWorkWithTag> {
        // バリデーション
        if (apiWork.description.isNullOrEmpty()) {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }

        // 作品の取得
        val workWithTag = workManagerService.findWorkById(workId = workId)
        // 認証ユーザーの作品か確認
        val user = getUser() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        if (workWithTag.work.userId != user.userId) {
            return ResponseEntity(HttpStatus.FORBIDDEN)
        }

        // 説明文を更新
        workWithTag.work.description = apiWork.description!!
        // ステータスがposted以外の場合はpostedに更新し、postedAtを設定
        if (workWithTag.work.status != "posted") {
            workWithTag.work.status = "posted"
            workWithTag.work.postedAt = ZonedDateTime.now(ZoneId.of("Asia/Tokyo")).toInstant()
        }
        workManagerService.updateWork(workWithTag.work)
        return ResponseEntity.ok(toApiWorkWithTag(workWithTag))
    }

    override fun deleteWorksById(
        @PathVariable("workId") workId: String
    ): ResponseEntity<ApiWorkWithTag> {
        // 作品の取得
        val workWithTag = workManagerService.findWorkById(workId = workId)
        // 認証ユーザーの作品か確認
        val user = getUser() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        if (workWithTag.work.userId != user.userId) {
            return ResponseEntity(HttpStatus.FORBIDDEN)
        }

        // 作品の削除
        workManagerService.deleteWorkById(workId)
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
        val apiWorksWithTags = mutableListOf<ApiWorkWithTag>()
        workResult?.works?.forEach { work ->
            val apiWork = workMapper.toApiWork(work)
            val apiWorkWithTag = ApiWorkWithTag(apiWork = apiWork, apiTags = null)
            apiWorksWithTags.add(apiWorkWithTag)
        }
        val apiWorkWithDetails = ApiWorksWithSearchResult(apiWorksWithTags, workResult?.totalCount ?: 0)
        return ResponseEntity.ok(apiWorkWithDetails)
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