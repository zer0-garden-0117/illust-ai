package com.uag.zer0.service

import com.uag.zer0.entity.*
import com.uag.zer0.generated.model.ApiWorksWithTags
import com.uag.zer0.mapper.WorkMapper
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
    private val counterService: CounterService,
    private val workMapper: WorkMapper
) {

    fun createWork(apiWorksWithTags: ApiWorksWithTags) {
        val work = workMapper.toWork(apiWorksWithTags)
        val nextId = counterService.getNextWorkId()
        work.id = nextId.toString()
        workRepository.save(work)
    }

    fun getWorkWithTags(workId: String): ApiWorksWithTags {
        val work = workRepository.findById(workId).orElse(null)
        val workTags = workTagRepository.findByWorkTagId_WorkId(workId)
        val response = workMapper.toApiWorkWithTags(work, workTags)
        return response
    }

    fun updateWork(workId: String, apiWorksWithTags: ApiWorksWithTags): Work? {
        if (workRepository.existsById(workId)) {
            val work = workMapper.toWork(apiWorksWithTags)
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

    fun deleteImage(imgId: String) {
        imageRepository.deleteById(imgId)
    }

    fun getWorksByCategory(category: String): List<Work> {
        return workRepository.findByCategory(category)
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
}