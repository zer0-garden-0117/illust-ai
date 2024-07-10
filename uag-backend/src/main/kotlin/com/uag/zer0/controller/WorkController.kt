package com.uag.zer0.controller

import com.uag.zer0.entity.Image
import com.uag.zer0.entity.Tag
import com.uag.zer0.entity.Work
import com.uag.zer0.entity.WorkTag
import com.uag.zer0.service.WorkService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/works")
class WorkController(
    private val workService: WorkService
) {

    @GetMapping("/{id}")
    fun getWork(@PathVariable id: String): Work? {
        return workService.getWork(id)
    }

    @PostMapping
    fun createWork(@RequestBody work: Work): Work {
        return workService.createWork(work)
    }

    @PostMapping("/{workId}/tags")
    fun addTagToWork(
        @PathVariable workId: String,
        @RequestBody tag: Tag
    ): WorkTag {
        return workService.addTagToWork(workId, tag)
    }

    @PostMapping("/images")
    fun createImage(@RequestBody image: Image): Image {
        return workService.createImage(image)
    }

    @GetMapping("/{id}/images")
    fun getImagesByWorkId(@PathVariable id: String): List<Image> {
        return workService.getImagesByWorkId(id)
    }

    @GetMapping("/{id}/tags")
    fun getTagsByWorkId(@PathVariable id: String): List<Tag> {
        return workService.getTagsByWorkId(id)
    }

    @PutMapping("/{id}")
    fun updateWork(@PathVariable id: String, @RequestBody work: Work): Work? {
        return workService.updateWork(id, work)
    }

    @DeleteMapping("/{id}")
    fun deleteWork(@PathVariable id: String): ResponseEntity<String> {
        return try {
            workService.deleteWork(id)
            ResponseEntity.ok("Work with ID $id deleted successfully")
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
        }
    }

    @DeleteMapping("/images/{id}")
    fun deleteImage(@PathVariable id: String) {
        workService.deleteImage(id)
    }

    @PostMapping("/category")
    fun getWorksByCategory(@RequestBody request: CategoryRequest): List<Work> {
        return workService.getWorksByCategory(request.category)
    }
}

data class CategoryRequest(
    var category: String = ""
)