package com.uag.zer0.mapper

import com.uag.zer0.converter.LocalDateTimeConverter
import com.uag.zer0.entity.Work
import com.uag.zer0.entity.WorkTag
import com.uag.zer0.generated.model.ApiTagsListInner
import com.uag.zer0.generated.model.ApiWorks
import com.uag.zer0.generated.model.ApiWorksWithTags
import com.uag.zer0.repository.TagRepository
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class WorkMapper(
    private val localDateTimeConverter: LocalDateTimeConverter,
    private val tagRepository: TagRepository
) {

    fun toWork(apiWorksWithTags: ApiWorksWithTags?): Work {
        if (apiWorksWithTags?.apiWorks == null) {
            throw IllegalArgumentException("ApiWorksWithTags or its work property is null")
        }

        val works = apiWorksWithTags.apiWorks
//        val tags = apiWorksWithTags.apiTagsList.map {
//            Tag(
//                id = it.tagId,
//                name = it.tagName
//            )
//        }

        return Work(
            id = works.workId.toString(),
            title = works.workTitle,
            titleImageUrl = works.titleImageUrl,
            creator = works.creator,
            category = works.category,
            subject = works.subject,
            language = works.language,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now(),
            likes = works.likes,
            downloads = works.downloads,
        )
    }

    fun toApiWork(work: Work): ApiWorks {
        return ApiWorks(
            workId = work.id.toInt(),
            workTitle = work.title,
            titleImageUrl = work.titleImageUrl,
            creator = work.creator,
            category = work.category,
            subject = work.subject,
            language = work.language,
            createdAt = work.createdAt.atOffset(ZoneOffset.ofHours(9)),
            updatedAt = work.updatedAt.atOffset(ZoneOffset.ofHours(9)),
            likes = work.likes,
            downloads = work.downloads
        )
    }

    fun toApiWorkWithTags(
        work: Work,
        workTags: List<WorkTag>
    ): ApiWorksWithTags {
        val apiWorks = ApiWorks(
            workId = work.id.toInt(),
            workTitle = work.title,
            titleImageUrl = work.titleImageUrl,
            creator = work.creator,
            category = work.category,
            subject = work.subject,
            language = work.language,
            createdAt = work.createdAt.atOffset(ZoneOffset.ofHours(9)),
            updatedAt = work.updatedAt.atOffset(ZoneOffset.ofHours(9)),
            likes = work.likes,
            downloads = work.downloads
        )

        val apiTagsList = workTags.map { workTag ->
            val tag = tagRepository.findById(workTag.workTagId?.tagId ?: "")
            ApiTagsListInner(
                tagId = tag.get().id.toInt(),
                tagName = tag.get().name
            )
        }

        return ApiWorksWithTags(
            apiWorks = apiWorks,
            apiTagsList = apiTagsList
        )
    }
}