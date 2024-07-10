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

    @PostMapping
    fun createWork(@RequestBody work: Work): Work {
        return workService.createWork(work)
    }

    @GetMapping("/{workId}")
    fun getWork(@PathVariable workId: String): Work? {
        return workService.getWork(workId)
    }

    @PutMapping("/{workId}")
    fun updateWork(
        @PathVariable workId: String,
        @RequestBody work: Work
    ): Work? {
        return workService.updateWork(workId, work)
    }

    @DeleteMapping("/{workId}")
    fun deleteWork(@PathVariable workId: String): ResponseEntity<String> {
        return try {
            workService.deleteWork(workId)
            ResponseEntity.ok("Work with ID $workId deleted successfully")
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
        }
    }

    @GetMapping("/{workId}/images")
    fun getImagesByWorkId(@PathVariable workId: String): List<Image> {
        return workService.getImagesByWorkId(workId)
    }

    @GetMapping("/{workId}/tags")
    fun getTagsByWorkId(@PathVariable workId: String): List<Tag> {
        return workService.getTagsByWorkId(workId)
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

    @DeleteMapping("/images/{imgId}")
    fun deleteImage(@PathVariable imgId: String) {
        workService.deleteImage(imgId)
    }

    @PostMapping("/category")
    fun getWorksByCategory(@RequestBody request: CategoryRequest): List<Work> {
        return workService.getWorksByCategory(request.category)
    }
}

data class CategoryRequest(
    var category: String = ""
)