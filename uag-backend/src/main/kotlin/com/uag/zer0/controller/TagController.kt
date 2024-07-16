//package com.uag.zer0.controller
//
//import org.springframework.web.bind.annotation.*
//
//@RestController
//@RequestMapping("/tags")
//class TagController(
//    private val tagService: TagService
//) {
//
//    @GetMapping
//    fun getAllTags(): List<Tag> {
//        return tagService.getAllTags()
//    }
//
//    @PostMapping
//    fun createTag(@RequestBody tag: Tag): Tag {
//        return tagService.createTag(tag)
//    }
//
//    @GetMapping("/{tagId}")
//    fun getTag(@PathVariable tagId: String): Tag? {
//        return tagService.getTag(tagId)
//    }
//
//    @DeleteMapping("/{tagId}")
//    fun deleteTag(@PathVariable tagId: String): String {
//        tagService.deleteTag(tagId)
//        return "Tag with ID $tagId deleted successfully"
//    }
//}