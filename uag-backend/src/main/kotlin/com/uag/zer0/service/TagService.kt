package com.uag.zer0.service

import com.uag.zer0.entity.Tag
import com.uag.zer0.repository.TagRepository
import com.uag.zer0.repository.WorkTagRepository
import org.springframework.stereotype.Service

@Service
class TagService(
    private val tagRepository: TagRepository,
    private val counterService: CounterService,
    private val workTagRepository: WorkTagRepository
) {

    fun createTag(tag: Tag): Tag {
        val newId = counterService.getNextTagId().toString()
        val newTag = tag.copy(id = newId)
        return tagRepository.save(newTag)
    }

    fun getAllTags(): List<Tag> {
        return tagRepository.findAll().toList()
    }

    fun getTag(id: String): Tag? {
        return tagRepository.findById(id).orElse(null)
    }

    fun deleteTag(id: String) {
        // タグに紐づけられているwork_tagsを削除
        val workTags = workTagRepository.findByWorkTagId_TagId(id)
        workTags.forEach { workTagRepository.delete(it) }

        tagRepository.deleteById(id)
    }
}