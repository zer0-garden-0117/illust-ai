package com.ila.zer0.service.user

import com.ila.zer0.controller.UsersController
import com.ila.zer0.dto.FollowWithSearchResult
import com.ila.zer0.dto.UsersActivity
import com.ila.zer0.dto.UsersWithSearchResult
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
    private val usageService: UsageService,
    private val productService: ProductService
) {
    val logger = LoggerFactory.getLogger(UserManagerService::class.java)

    @Transactional
    fun registerUser(
        userId: String,
        userName: String
    ): User {
        val newUser = User()
        newUser.userId = userId
        newUser.customUserId = uuidService.generateUuid()
        newUser.userName = userName
        newUser.userProfile = ""
        newUser.profileImageUrl = "https://ila-backend.s3.us-east-2.amazonaws.com/icon2.png"
        newUser.coverImageUrl = "https://ila-backend.s3.us-east-2.amazonaws.com/cover2.png"
        newUser.plan = "Free"
        newUser.boost = listOf()
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
        user.illustNumLimit = calLimitNumByPlanAndBoost(user.plan, user.boost)
        user.remainingIllustNum = usageService.getRemainingToday(userId, user.illustNumLimit)
        val products = productService.findActive(user.userId)
        // productsにBasicが含まれていればplanをBasicに設定、含まれていなければFreeに設定
        // planをBasicにする場合は、Basic:it.autoUpdateToの形式でuser.planに設定
        if (products.any { it.product == "Basic" }) {
            val basicProduct = products.first { it.product == "Basic" }
            user.plan = "Basic:" + basicProduct.autoUpdateTo
        } else {
            user.plan = "Free"
        }
        // boostにBasic以外の有効なプランをプロダクト名:有効期限の形式で追加
        user.boost = products.filter { it.product != "Basic" }
            .map { it.product + ":" + it.supportTo }
        return user
    }

    @Transactional
    fun getUserByIdForWork(
        userId: String
    ): User? {
        val user = userService.findUserById(userId) ?: return null
        return user
    }

    @Transactional
    fun findUserByCustomUserId(
        customUserId: String
    ): User? {
        val user = userService.findUserByCustomUserId(customUserId)
        if (user == null) {
            logger.info("user is null $customUserId")
            return null
        }
        return user
    }

    @Transactional
    fun getUserByCustomUserId(
        customUserId: String,
        callerUserId: String
    ): User? {
        val user = userService.findUserByCustomUserId(customUserId)
        if (user == null) {
            logger.info("user is null $customUserId")
            return null
        }
        val follows = followService.findByUserId(user.userId)
        logger.info("follows list: $follows")
        val followers = followService.findByFollowUserId(user.userId)
        logger.info("followers list: $followers")
        user.follow = follows.size
        user.follower = followers.size
        user.isFollowing = followers.any { it.userId == callerUserId }
        user.isFollowed = follows.any { it.followUserId == callerUserId }
        return user
    }

    @Transactional
    fun updateUser(
        user: User,
        coverImage: MultipartFile,
        profileImage: MultipartFile,
        customUserId: String,
        userName: String,
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
                user.userId + "_coverImage_" + Instant.now().toEpochMilli() + ".png",
                "image/png"
            )
            user.coverImageUrl = coverImageUrl
        }

        // アイコン画像の変換
        if (profileImage.size != 0.toLong() && profileImage.originalFilename != "") {
            val profileImagePng = try {
                convertService.toPng(profileImage)
            } catch (e: Exception) {
                logger.error("Failed to profile image to Png: ${e.message}")
                throw RuntimeException("Error during profile image conversion")
            }
            val profileImageUrl = s3Service.uploadToS3(
                profileImagePng,
                user.userId + "_profileImage_" + Instant.now().toEpochMilli() + ".png",
                "image/png")
            user.profileImageUrl = profileImageUrl
        }

        // customUserIdの更新
        user.customUserId = customUserId
        // userNameの更新
        user.userName = userName
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
    fun getFollowUsersByCustomUserId(customUserId: String, offset: Int, limit: Int, followType: String, callerUserId: String): UsersWithSearchResult? {
        val user = userService.findUserByCustomUserId(customUserId)
        if (user == null) {
            logger.info("user is null $customUserId")
            return null
        }

        val followIds = mutableListOf<String>()
        var followResult: FollowWithSearchResult
        when (followType) {
            "follow" -> {
                followResult = followService.findByUserIdWithOffset(user.userId, offset, limit)
                followResult.follows.forEach { follow ->
                    followIds.add(follow.followUserId)
                }
            }
            "follower" -> {
                followResult = followService.findByFollowUserIdWithOffset(user.userId, offset, limit)
                followResult.follows.forEach { follow ->
                    followIds.add(follow.userId)
                }
            }
            else -> {
                logger.info("Invalid followType: $followType")
                return null
            }
        }

        // userIdでユーザー情報を取得
        val followUsers = mutableListOf<User>()
        val callerUserFollows = followService.findByUserId(callerUserId)
        followIds.forEach { followId ->
            val followUser = userService.findUserById(followId)
            // callerUserFollowsにfollowUser.userIdが含まれているかどうかでisFollowingを設定
            followUser?.isFollowing = callerUserFollows.any { it.followUserId == followId }
            followUser?.let { followUsers.add(it) }
        }

        return UsersWithSearchResult(followUsers, followResult.totalCount)
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

    fun calLimitNumByPlanAndBoost(plan: String, boost: List<String>): Int {
        val basePlan = plan.split(":").first()
        var limitNum = when (basePlan) {
            "Free" -> 3
            "Basic" -> 10
            else -> 3
        }
        boost.forEach {
            val plan = it.split(":").first()
            limitNum += when (plan) {
                "Boost S" -> 10
                "Boost M" -> 10
                "Boost L" -> 20
                else -> 0
            }
        }
        return limitNum
    }
}