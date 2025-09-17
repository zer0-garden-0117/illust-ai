package com.ila.zer0.service.user

import com.ila.zer0.controller.UsersController
import com.ila.zer0.dto.UsersActivity
import com.ila.zer0.dto.WorksWithSearchResult
import com.ila.zer0.entity.Follow
import com.ila.zer0.entity.Liked
import com.ila.zer0.entity.User
import com.ila.zer0.entity.Work
import com.ila.zer0.service.ConvertService
import com.ila.zer0.service.S3Service
import com.ila.zer0.service.UuidService
import com.ila.zer0.service.tag.TagService
import com.ila.zer0.service.work.WorkService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.multipart.MultipartFile
import java.time.Instant

@Service
class UserManagerService(
    private val userService: UserService,
    private val followService: FollowService,
    private val likedService: LikedService,
    private val workService: WorkService,
    private val tagService: TagService,
    private val uuidService: UuidService,
    private val convertService: ConvertService,
    private val s3Service: S3Service,
) {
    val logger = LoggerFactory.getLogger(UserManagerService::class.java)

    @Transactional
    fun registerUser(
        userId: String
    ): User {
        val newUser = User()
        newUser.userId = userId
        newUser.customUserId = uuidService.generateUuid()
        newUser.userName = userId
        newUser.userProfile = ""
        newUser.profileImageUrl = "https://ila-backend.s3.us-east-2.amazonaws.com/icon2.png"
        newUser.coverImageUrl = "https://ila-backend.s3.us-east-2.amazonaws.com/cover2.png"
        newUser.createdAt = Instant.now()
        newUser.updatedAt = Instant.now()
        return userService.registerUser(newUser)
    }

    @Transactional
    fun getUserById(
        userId: String
    ): User? {
        val user = userService.findUserById(userId) ?: return null
        val followCount = followService.getFollowerCount(userId)
        val followerCount = followService.getFollowerCount(userId)
        user.follow = followCount
        user.follower = followerCount
        return user
    }

    @Transactional
    fun getUserByCustomUserId(
        customUserId: String
    ): User? {
        val user = userService.findUserByCustomUserId(customUserId)
        if (user == null) {
            logger.info("user is null $customUserId")
            return null
        }
        val followCount = followService.getFollowerCount(user.userId)
        val followerCount = followService.getFollowerCount(user.userId)
        user.follow = followCount
        user.follower = followerCount
        return user
    }

    @Transactional
    fun updateUser(
        user: User,
        coverImage: MultipartFile,
        profileImage: MultipartFile,
        customUserId: String,
        userProfile: String
    ): User {
        // 引数をすべてログ出力
        logger.info("Updating user: ${user.userId}, customUserId: $customUserId")
        logger.info("User profile: $userProfile")
        logger.info("ProfileImage: ${profileImage.originalFilename}, size: ${profileImage.size}, type: ${profileImage.contentType}")
        logger.info("CoverImage: ${coverImage.originalFilename}, size: ${coverImage.size}, type: ${coverImage.contentType}")
        // カバー画像の変換
        if (coverImage.size != 0.toLong() && coverImage.originalFilename != "") {
            val coverImagePng = try {
                convertService.toPng(coverImage)
            } catch (e: Exception) {
                logger.error("Failed to cover image to Png: ${e.message}")
                throw RuntimeException("Error during cover image conversion")
            }
            val coverImageUrl = s3Service.uploadToS3(
                coverImagePng,
                user.userId + "_coverImage.png",
                "image/png"
            )
            user.coverImageUrl = coverImageUrl
        }

        // アイコン画像の変換
        if (profileImage.size != 0.toLong() && profileImage.originalFilename != "") {
            val profileImagePng = try {
                convertService.toPng(coverImage)
            } catch (e: Exception) {
                logger.error("Failed to profile image to Png: ${e.message}")
                throw RuntimeException("Error during profile image conversion")
            }
            val profileImageUrl = s3Service.uploadToS3(
                profileImagePng,
                user.userId + "_profileImage.png",
                "image/png")
            user.profileImageUrl = profileImageUrl
        }

        // customUserIdの更新
        user.customUserId = customUserId
        // userProfileの更新
        user.userProfile = userProfile
        return userService.updateUser(user)
    }

    @Transactional
    fun deleteUser(
        userId: String
    ): User {
        return userService.deleteUserById(userId)
    }

    @Transactional
    fun followUser(
        userId: String,
        followUserId: String
    ): User {
        followService.registerFollow(userId, followUserId)
        val user = User(
            userId = userId,
            isFollowing = true
        )
        return user
    }

    @Transactional
    fun unfollowUser(
        userId: String,
        followUserId: String
    ): User {
        followService.deleteFollow(userId, followUserId)
        val user = User(
            userId = userId,
            isFollowing = true
        )
        return user
    }

    @Transactional
    fun searchUsersActivity(
        userId: String,
        workIds: MutableList<String>
    ): UsersActivity {
        val liked = likedService.findByUserIdsAndWorkIds(userId, workIds)
        return UsersActivity(
            liked = liked
        )
    }

    @Transactional
    fun getUsersLiked(
        userId: String,
        offset: Int,
        limit: Int
    ): WorksWithSearchResult {
        val likedWithSearchResult =
            likedService.findByUserIdWithOffset(userId, offset, limit)

        val works = mutableListOf<Work>()
        likedWithSearchResult.liked.forEach { liked ->
            val work = workService.findWorkById(liked.workId)
            works.add(work)
        }

        return WorksWithSearchResult(
            works = works,
            totalCount = likedWithSearchResult.totalCount
        )
    }

    @Transactional
    fun getUsersLikedWithFilter(
        userId: String,
        offset: Int,
        limit: Int,
        words: List<String>
    ): WorksWithSearchResult {
        val likeds = likedService.findByUserId(userId)
        val likedWorkIds = likeds.map { it.workId }.toSet()

        // 各検索サービスから結果を取得
        val searchResults = listOf(
            tagService.findByTagsAsWork(words)
        )

        val workIds = searchResults
            .flatMap { results ->
                results.filter { likedWorkIds.contains(it.workId) }.map { it }
            }
            .distinct()

        // updatedAt順にソート（降順）
        val sortedWorkIds =
            workIds.sortedByDescending { it.updatedAt }

        // offsetで指定した件数分スキップし、limit分だけ返す
        val filteredWorkIds = sortedWorkIds.drop(offset).take(limit)

        return WorksWithSearchResult(
            works = filteredWorkIds,
            totalCount = sortedWorkIds.size
        )
    }

    @Transactional
    fun registerUsersLiked(userId: String, workId: String): Liked {
        val liked = likedService.registerLiked(userId, workId)
        workService.addLikedToWork(workId)
        return liked
    }

    @Transactional
    fun deleteUsersLiked(userId: String, workId: String): Liked {
        val liked =  likedService.deleteLiked(userId, workId)
        workService.deleteLikedToWork(workId)
        return liked
    }

    @Transactional
    fun deleteWorkId(workId: String) {
        // likedテーブルから削除
        likedService.deleteWork(workId)
    }

    @Transactional
    fun deleteUsers(userId: String) {
        likedService.deleteUser(userId)
    }
}