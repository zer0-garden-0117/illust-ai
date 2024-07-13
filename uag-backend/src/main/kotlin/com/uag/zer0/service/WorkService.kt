package com.uag.zer0.service

import com.uag.zer0.entity.*
import com.uag.zer0.generated.model.ApiWorks
import com.uag.zer0.generated.model.ApiWorksWithDetails
import com.uag.zer0.mapper.WorkMapper
import com.uag.zer0.repository.ImageRepository
import com.uag.zer0.repository.TagRepository
import com.uag.zer0.repository.WorkRepository
import com.uag.zer0.repository.WorkTagRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class WorkService(
    private val workRepository: WorkRepository,
    private val tagRepository: TagRepository,
    private val workTagRepository: WorkTagRepository,
    private val imageRepository: ImageRepository,
    private val counterService: CounterService,
    private val workMapper: WorkMapper
) {

    private val logger = LoggerFactory.getLogger(WorkService::class.java)

    fun createWork(apiWorksWithTags: ApiWorksWithDetails) {
        val work = workMapper.toWork(apiWorksWithTags)
        val nextId = counterService.getNextWorkId()
        work.workId = nextId.toString()
        workRepository.save(work)
    }

    fun getWorkWithTags(workId: String): ApiWorksWithDetails {
        val work = workRepository.findById(workId).orElse(null)
        val workTags = workTagRepository.findByWorkTagIdWorkId(workId)
        val imgList = imageRepository.findByWorkId(workId)
        val response = workMapper.toApiWorkWithDetails(work, workTags, imgList)
        return response
    }

    fun searchWorks(apiWorksWithTags: ApiWorksWithDetails?): List<ApiWorks> {
        val works = apiWorksWithTags?.apiWorks ?: return emptyList()

        logger.info("Starting searchWorks with apiWorksWithTags: $apiWorksWithTags")

        var result: List<Work> = emptyList()

        works.mainTitle.takeIf { it!!.isNotBlank() }?.let { title ->
            logger.info("Searching by title: $title")
            result = workRepository.findByMainTitle(title)
            logger.info("Found ${result.size} works by title")
        }

        works.creator.takeIf { it!!.isNotBlank() }?.let { creator ->
            logger.info("Filtering by creator: $creator")
            result = if (result.isEmpty()) {
                workRepository.findByCreator(creator)
            } else {
                result.filter { it.creator == creator }
            }
            logger.info("Found ${result.size} works by creator")
        }

//        works.category.takeIf { it.isNotBlank() }?.let { category ->
//            logger.info("Filtering by category: $category")
//            result = if (result.isEmpty()) {
//                workRepository.findByCategory(category)
//            } else {
//                result.filter { it.category == category }
//            }
//            logger.info("Found ${result.size} works by category")
//        }
//
//        works.subject.takeIf { it.isNotBlank() }?.let { subject ->
//            logger.info("Filtering by subject: $subject")
//            result = if (result.isEmpty()) {
//                workRepository.findBySubject(subject)
//            } else {
//                result.filter { it.subject == subject }
//            }
//            logger.info("Found ${result.size} works by subject")
//        }

//        works.language.takeIf { it.isNotBlank() }?.let { language ->
//            logger.info("Filtering by language: $language")
//            result = if (result.isEmpty()) {
//                workRepository.findByLanguage(language)
//            } else {
//                result.filter { it.language == language }
//            }
//            logger.info("Found ${result.size} works by language")
//        }

//        works.createdAt?.let { createdAt ->
//            logger.info("Filtering by createdAt: $createdAt")
//            result = if (result.isEmpty()) {
//                workRepository.findByCreatedAt(createdAt)
//            } else {
//                result.filter { it.createdAt == createdAt }
//            }
//            logger.info("Found ${result.size} works by createdAt")
//        }
//
//        works.updatedAt?.let { updatedAt ->
//            logger.info("Filtering by updatedAt: $updatedAt")
//            result = if (result.isEmpty()) {
//                workRepository.findByUpdatedAt(updatedAt)
//            } else {
//                result.filter { it.updatedAt == updatedAt }
//            }
//            logger.info("Found ${result.size} works by updatedAt")
//        }

//        works.likes.let { likes ->
//            logger.info("Filtering by likes: $likes")
//            result = if (result.isEmpty()) {
//                workRepository.findByLikes(likes)
//            } else {
//                result.filter { it.likes == likes }
//            }
//            logger.info("Found ${result.size} works by likes")
//        }
//
//        works.downloads.let { downloads ->
//            logger.info("Filtering by downloads: $downloads")
//            result = if (result.isEmpty()) {
//                workRepository.findByDownloads(downloads)
//            } else {
//                result.filter { it.downloads == downloads }
//            }
//            logger.info("Found ${result.size} works by downloads")
//        }

        val apiWorks = result.map { workMapper.toApiWork(it) }
        logger.info("Final search result: $apiWorks")

        return apiWorks
    }

    fun updateWork(
        workId: String,
        apiWorksWithTags: ApiWorksWithDetails
    ): Work? {
        if (workRepository.existsById(workId)) {
            val work = workMapper.toWork(apiWorksWithTags)
            work.workId = workId
            return workRepository.save(work)
        }
        return null
    }

    fun deleteWork(workId: String) {
        if (!workRepository.existsById(workId)) {
            throw IllegalArgumentException("No work with id $workId exists!")
        }
        workRepository.deleteById(workId)
    }

    fun addTagToWork(workId: String, tag: Tag): WorkTag {
        val nextTagId = counterService.getNextTagId()
        tag.tagId = nextTagId.toString()
        val savedTag = tagRepository.save(tag)
        val workTag = WorkTag(
            workTagId = WorkTagId(workId = workId, tagId = savedTag.tagId)
        )
        return workTagRepository.save(workTag)
    }

    fun createImage(image: Image): Image {
        val nextId = counterService.getNextImageId()
        image.imgId = nextId.toString()
        return imageRepository.save(image)
    }

    fun deleteImage(imgId: String) {
        imageRepository.deleteById(imgId)
    }

    fun getWorksByCategory(category: String): List<Work> {
        return workRepository.findByMainTitle(category)
    }

    fun getImagesByWorkId(workId: String): List<Image> {
        return imageRepository.findByWorkId(workId)
    }

    fun getTagsByWorkId(workId: String): List<Tag> {
        val workTags = workTagRepository.findByWorkTagIdWorkId(workId)
        return workTags.mapNotNull {
            it.workTagId?.let { workTagId ->
                tagRepository.findById(workTagId.tagId).orElse(null)
            }
        }
    }
}