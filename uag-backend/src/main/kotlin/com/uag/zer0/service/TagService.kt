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
        val newTag = tag.copy(tagId = newId)
        return tagRepository.save(newTag)
    }

    fun getAllTags(): List<Tag> {
        return tagRepository.findAll().toList()
    }

    fun getTag(tagId: String): Tag? {
        return tagRepository.findById(tagId).orElse(null)
    }

    fun deleteTag(tagId: String) {
        // タグに紐づけられているwork_tagsを削除
        val workTags = workTagRepository.findByWorkTagIdTagId(tagId)
        workTags.forEach { workTagRepository.delete(it) }

        tagRepository.deleteById(tagId)
    }
}