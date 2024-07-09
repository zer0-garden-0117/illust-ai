package com.uag.zer0.controller

import com.uag.zer0.entity.*
import com.uag.zer0.repository.ImageRepository
import com.uag.zer0.repository.TagRepository
import com.uag.zer0.repository.WorkRepository
import com.uag.zer0.repository.WorkTagRepository
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/works")
class WorkController(
    private val workRepository: WorkRepository,
    private val imageRepository: ImageRepository,
    private val workTagRepository: WorkTagRepository,
    private val tagRepository: TagRepository
) {

    private val logger = LoggerFactory.getLogger(WorkController::class.java)

    @GetMapping("/{id}")
    fun getWork(@PathVariable id: String): Work? {
        return workRepository.findById(id).orElse(null)
    }

    @PostMapping
    fun createWork(@RequestBody work: Work): Work {
        return workRepository.save(work)
    }

    @GetMapping("/{id}/images")
    fun getImagesByWorkId(@PathVariable id: String): List<Image> {
        return imageRepository.findByWorkId(id)
    }

    @GetMapping("/{id}/tags")
    fun getTagsByWorkId(@PathVariable id: String): List<Tag> {
        val workTags = workTagRepository.findByWorkTagId_WorkId(id)
        return workTags.mapNotNull {
            it.workTagId?.let { it1 ->
                tagRepository.findById(it1.tagId).orElse(null)
            }
        }
    }

    @PostMapping("/{workId}/tags")
    fun addTagToWork(
        @PathVariable workId: String,
        @RequestBody tag: Tag
    ): WorkTag {
        logger.info("Start addTagToWork: workId={}, tag={}", workId, tag)

        val savedTag = tagRepository.save(tag)
        logger.info("Tag saved: {}", savedTag)

        val workTag = WorkTag(
            workTagId = WorkTagId(workId = workId, tagId = savedTag.id)
        )
        logger.info("WorkTag created: {}", workTag)

        val savedWorkTag = workTagRepository.save(workTag)
        logger.info("WorkTag saved: {}", savedWorkTag)

        return savedWorkTag
    }
}