package com.uag.zer0.controller

import com.uag.zer0.entity.Tag
import com.uag.zer0.repository.TagRepository
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tags")
class TagController(
    private val tagRepository: TagRepository
) {

    @PostMapping
    fun createTag(@RequestBody tag: Tag): Tag {
        return tagRepository.save(tag)
    }

    @GetMapping
    fun getAllTags(): List<Tag> {
        return tagRepository.findAll().toList()
    }

    @GetMapping("/{id}")
    fun getTag(@PathVariable id: String): Tag? {
        return tagRepository.findById(id).orElse(null)
    }
}