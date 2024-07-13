package com.uag.zer0.mapper

import com.uag.zer0.converter.LocalDateTimeConverter
import com.uag.zer0.entity.Image
import com.uag.zer0.entity.Work
import com.uag.zer0.entity.WorkTag
import com.uag.zer0.generated.model.ApiImgsInner
import com.uag.zer0.generated.model.ApiTagsListInner
import com.uag.zer0.generated.model.ApiWorks
import com.uag.zer0.generated.model.ApiWorksWithDetails
import com.uag.zer0.repository.ImageRepository
import com.uag.zer0.repository.TagRepository
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class WorkMapper(
    private val localDateTimeConverter: LocalDateTimeConverter,
    private val tagRepository: TagRepository,
    private val imageRepository: ImageRepository
) {

    fun toWork(apiWorksWithDetails: ApiWorksWithDetails?): Work {
        if (apiWorksWithDetails?.apiWorks == null) {
            throw IllegalArgumentException("ApiWorksWithTags or its work property is null")
        }

        val work = apiWorksWithDetails.apiWorks
//        val tags = apiWorksWithTags.apiTagsList.map {
//            Tag(
//                id = it.tagId,
//                name = it.tagName
//            )
//        }

        return Work(
            workId = work.workId.toString(),
            mainTitle = work.mainTitle ?: "",
            subTitle = work.subTitle ?: "",
            description = work.description ?: "",
            workFormat = work.workFormat ?: "",
            topicGenre = work.topicGenre ?: "",
            creator = work.creator ?: "",
            pages = work.pages ?: "",
            workSize = work.workSize ?: "",
            language = work.language ?: "",
            likes = work.likes ?: 0,
            downloads = work.downloads ?: 0,
            titleImageUrl = work.titleImageUrl ?: "",
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now(),
        )
    }

    fun toApiWork(work: Work): ApiWorks {
        return ApiWorks(
            workId = work.workId.toInt(),
            mainTitle = work.mainTitle,
            subTitle = work.subTitle,
            description = work.description,
            workFormat = work.workFormat,
            topicGenre = work.topicGenre,
            creator = work.creator,
            pages = work.pages,
            workSize = work.workSize,
            language = work.language,
            likes = work.likes,
            downloads = work.downloads,
            titleImageUrl = work.titleImageUrl,
            createdAt = work.createdAt.atOffset(ZoneOffset.ofHours(9)),
            updatedAt = work.updatedAt.atOffset(ZoneOffset.ofHours(9)),
        )
    }

    fun toApiWorkWithDetails(
        work: Work,
        workTags: List<WorkTag>,
        imgList: List<Image>
    ): ApiWorksWithDetails {
        val apiWorks = ApiWorks(
            workId = work.workId.toInt(),
            mainTitle = work.mainTitle,
            subTitle = work.subTitle,
            description = work.description,
            workFormat = work.workFormat,
            topicGenre = work.topicGenre,
            creator = work.creator,
            pages = work.pages,
            workSize = work.workSize,
            language = work.language,
            likes = work.likes,
            downloads = work.downloads,
            titleImageUrl = work.titleImageUrl,
            createdAt = work.createdAt.atOffset(ZoneOffset.ofHours(9)),
            updatedAt = work.updatedAt.atOffset(ZoneOffset.ofHours(9)),
        )

        val apiTagsList = workTags.map { workTag ->
            val tag = tagRepository.findById(workTag.workTagId?.tagId ?: "")
            ApiTagsListInner(
                tagId = tag.get().tagId.toInt(),
                tagName = tag.get().tagName
            )
        }

        val apiImgList = imgList.map { img ->
            ApiImgsInner(
                imgId = img.imgId.toInt(),
                imgUrl = img.s3Url,
                imgPageNum = img.pageNumber
            )
        }

        return ApiWorksWithDetails(
            apiWorks = apiWorks,
            apiTagsList = apiTagsList,
            apiImgsList = apiImgList
        )
    }
}