package com.ila.zer0.service.work

import com.ila.zer0.dto.FollowWithSearchResult
import com.ila.zer0.dto.LikesCountAndIsLiked
import com.ila.zer0.dto.UsersWithSearchResult
import com.ila.zer0.dto.WorkWithTag
import com.ila.zer0.dto.WorksWithSearchResult
import com.ila.zer0.entity.Tag
import com.ila.zer0.entity.User
import com.ila.zer0.entity.Work
import com.ila.zer0.repository.TagRepository
import com.ila.zer0.repository.UserRepository
import com.ila.zer0.repository.WorkRepository
import com.ila.zer0.service.SqsService
import com.ila.zer0.service.UuidService
import com.ila.zer0.service.tag.TagService
import com.ila.zer0.service.user.FollowService
import com.ila.zer0.service.user.LikedService
import com.ila.zer0.service.user.UserManagerService
import com.ila.zer0.service.user.UserService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class WorkManagerService(
    private val workRepository: WorkRepository,
    private val workService: WorkService,
    private val tagRepository: TagRepository,
    private val tagService: TagService,
    private val sqsService: SqsService,
    private val uuidService: UuidService,
    private val userService: UserService,
    private val userManagerService: UserManagerService,
    private val likedService: LikedService,
    private val userRepository: UserRepository,
    private val followService: FollowService
) {

    private val logger = LoggerFactory.getLogger(WorkService::class.java)

    @Transactional
    fun createWork(work: Work): Work {
        // 作品の登録
        val nowDate = Instant.now()
        val workId = uuidService.generateUuid()
        work.workId = workId
        work.status = "creating"
        work.updatedAt = nowDate
        work.createdAt = nowDate
        workService.registerWork(work)

        // 画像生成SQS通知
        sqsService.sendCreateImageMessage(
            work.workId,
            "create",
            work.prompt,
            work.negativePrompt,
            work.model,
            work.createdAt
        )
        return work
    }

    @Transactional
    fun updateWork(updatedWork: Work, isFirstUpdate: Boolean): Work {
        workService.updateWork(updatedWork)
        tagService.registerTagsFromDescription(updatedWork.workId, updatedWork.description, isFirstUpdate)
        return updatedWork
    }

    @Transactional
    fun findWorkById(workId: String): WorkWithTag {
        val work = workService.findWorkById(workId)
        val tags = tagRepository.findByWorkId(workId)
        return WorkWithTag(
            work = work,
            tags = tags
        )
    }

    @Transactional
    fun getUsersWorksByCustomUserIdWithFilter(myUserId: String, customUserId: String, offset: Int, limit: Int, userWorksFilterType: String): WorksWithSearchResult? {
        val user = userService.findUserByCustomUserId(customUserId)
        if (user == null) {
            logger.info("user is null $customUserId")
            return null
        }

        when (userWorksFilterType) {
            "posted", "created" -> {
                return workService.findByUserIdWithOffset(user.userId, offset, limit, userWorksFilterType)
            }
            "liked" -> {
                return userManagerService.getUsersLiked(user.userId, offset, limit)
            }
            "followUserPosted" -> {
                return getFollowUserWorks(myUserId, offset, limit)
            }
            else -> {
                logger.info("不正なuserWorksFilterTypeが指定されました: $userWorksFilterType")
                return null
            }
        }
    }

    @Transactional
    fun findWorksByTags(words: List<String>?, offset: Int, limit: Int): WorksWithSearchResult? {
        // 空のリストやnullチェック
        if (words.isNullOrEmpty()) {
            logger.info("入力されたタグが空、もしくはnullです。")
            return null
        }

        // 各単語でタグ検索
        val workIds = mutableListOf<String>()
        val tagResult = tagService.findByTagsWithOffset(words, offset, limit)
        tagResult.tags.forEach { tag ->
            workIds.add(tag.workId)
        }

        // 作品情報取得
        val works = workRepository.findByWorkIds(workIds)

        // ユーザー情報取得
        val userIds = works.map { it.userId }.toSet().toList()
        val users = userRepository.findByUserIds(userIds)

        // ユーザー情報を作品に紐付け
        val userMap = users.associateBy { it.userId }
        works.forEach { work ->
            userMap[work.userId]?.let { user ->
                work.userName = user.userName
                work.customUserId = user.customUserId
                work.profileImageUrl = user.profileImageUrl
            }
        }
        return WorksWithSearchResult(works, tagResult.totalCount)
    }

    @Transactional
    fun findWorksByTags(words: List<String>?): WorksWithSearchResult? {
        // 空のリストやnullチェック
        if (words.isNullOrEmpty()) {
            logger.info("入力されたタグが空、もしくはnullです。")
            return null
        }

        // 各単語でタグ検索
        val workIds = mutableListOf<String>()
        val tagResult = tagService.findByTagsWithoutOffset(words)
        tagResult.tags.forEach { tag ->
            workIds.add(tag.workId)
        }

        // 作品情報取得
        val works = workRepository.findByWorkIds(workIds)

        // ユーザー情報取得
        val userIds = works.map { it.userId }.toSet().toList()
        val users = userRepository.findByUserIds(userIds)

        // ユーザー情報を作品に紐付け
        val userMap = users.associateBy { it.userId }
        works.forEach { work ->
            userMap[work.userId]?.let { user ->
                work.userName = user.userName
                work.customUserId = user.customUserId
                work.profileImageUrl = user.profileImageUrl
            }
        }
        return WorksWithSearchResult(works, tagResult.totalCount)
    }

    @Transactional
    fun deleteWorkById(workId: String): WorkWithTag {
        // 作品の取得
        val work = workRepository.findByWorkId(workId)
        val tags = tagRepository.findByWorkId(workId)

        // workテーブルから削除
        workService.deleteWorkById(workId)

        // tagテーブルから削除
        tagRepository.deleteTagByWorkId(workId)

        return WorkWithTag(
            work = work,
            tags = tags
        )
    }

    @Transactional
    fun getLikesCountAndIsLikedByWorkId(workId: String, userId: String): LikesCountAndIsLiked {
        val likeds =  likedService.findByWorkId(workId)
        return LikesCountAndIsLiked(
            likesCount = likeds.size,
            isLiked = likeds.any { it.userId == userId }
        )
    }

    fun getFollowUserWorks(userId: String, offset: Int, limit: Int): WorksWithSearchResult {
        // フォロー一覧を取得
        val follows = followService.findByUserId(userId)
        // followsからfollowUserIdの一覧を生成
        val followUserIds = follows.map { it.followUserId }

        // GLOBALでoffset,limitを指定せず取得
        val worksWithSearchResult = findWorksByTags(listOf("GLOBAL"))

        // worksの中から下記の条件で抽出
        // works.userIdがfollowUserIdsのリストに含まれるものだけを抽出
        val filterWork = worksWithSearchResult?.works?.filter { work ->
            followUserIds.contains(work.userId)
        }

        // filterWorkからWorksWithSearchResultを生成
        val result = WorksWithSearchResult(
            works = filterWork ?: listOf(),
            totalCount = filterWork?.size ?: 0
        )
        return result
    }
}