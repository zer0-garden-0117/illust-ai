package com.uag.zer0.service

import com.uag.zer0.entity.*
import com.uag.zer0.repository.ImageRepository
import com.uag.zer0.repository.TagRepository
import com.uag.zer0.repository.WorkRepository
import com.uag.zer0.repository.WorkTagRepository
import org.springframework.stereotype.Service

@Service
class WorkService(
    private val workRepository: WorkRepository,
    private val tagRepository: TagRepository,
    private val workTagRepository: WorkTagRepository,
    private val imageRepository: ImageRepository,
    private val counterService: CounterService
) {

    fun createWork(work: Work): Work {
        val nextId = counterService.getNextWorkId()
        work.id = nextId.toString()
        return workRepository.save(work)
    }

    fun addTagToWork(workId: String, tag: Tag): WorkTag {
        val nextTagId = counterService.getNextTagId()
        tag.id = nextTagId.toString()
        val savedTag = tagRepository.save(tag)
        val workTag = WorkTag(
            workTagId = WorkTagId(workId = workId, tagId = savedTag.id)
        )
        return workTagRepository.save(workTag)
    }

    fun createImage(image: Image): Image {
        val nextId = counterService.getNextImageId()
        image.id = nextId.toString()
        return imageRepository.save(image)
    }

    fun getWork(workId: String): Work? {
        return workRepository.findById(workId).orElse(null)
    }

    fun getImagesByWorkId(workId: String): List<Image> {
        return imageRepository.findByWorkId(workId)
    }

    fun getTagsByWorkId(workId: String): List<Tag> {
        val workTags = workTagRepository.findByWorkTagId_WorkId(workId)
        return workTags.mapNotNull {
            it.workTagId?.let { workTagId ->
                tagRepository.findById(workTagId.tagId).orElse(null)
            }
        }
    }

    fun updateWork(workId: String, work: Work): Work? {
        if (workRepository.existsById(workId)) {
            work.id = workId
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

    fun deleteImage(imgId: String) {
        imageRepository.deleteById(imgId)
    }

    fun getWorksByCategory(category: String): List<Work> {
        return workRepository.findByCategory(category)
    }
}