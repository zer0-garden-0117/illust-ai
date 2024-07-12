package com.uag.zer0.mapper

import com.uag.zer0.entity.Tag
import com.uag.zer0.entity.Work
import com.uag.zer0.generated.model.ApiWorksWithTags
import java.time.LocalDateTime

class WorkMapper {

    fun toWork(apiWorksWithTags: ApiWorksWithTags?): Work {
        if (apiWorksWithTags?.apiWorks == null) {
            throw IllegalArgumentException("ApiWorksWithTags or its work property is null")
        }

        val works = apiWorksWithTags.apiWorks
        val tags = apiWorksWithTags.apiTagsList.map {
            Tag(
                id = it.tagId,
                name = it.tagName
            )
        }

        return Work(
            id = works.workId,
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

    fun toApiWork(apiWorksWithTags: ApiWorksWithTags?): Work {
        if (apiWorksWithTags?.apiWorks == null) {
            throw IllegalArgumentException("ApiWorksWithTags or its work property is null")
        }

        val works = apiWorksWithTags.apiWorks
        val tags = apiWorksWithTags.apiTagsList.map {
            Tag(
                id = it.tagId,
                name = it.tagName
            )
        }

        return Work(
            id = works.workId,
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

}