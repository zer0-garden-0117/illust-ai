package com.uag.zer0.controller

import com.uag.zer0.entity.Tag
import com.uag.zer0.service.TagService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/tags")
class TagController(
    private val tagService: TagService
) {

    @PostMapping
    fun createTag(@RequestBody tag: Tag): Tag {
        return tagService.createTag(tag)
    }

    @GetMapping
    fun getAllTags(): List<Tag> {
        return tagService.getAllTags()
    }

    @GetMapping("/{id}")
    fun getTag(@PathVariable id: String): Tag? {
        return tagService.getTag(id)
    }
    
    @DeleteMapping("/{id}")
    fun deleteTag(@PathVariable id: String): String {
        tagService.deleteTag(id)
        return "Tag with ID $id deleted successfully"
    }
}