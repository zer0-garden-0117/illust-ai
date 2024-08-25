package com.uag.zer0.mapper.work

import com.uag.zer0.entity.work.Img
import com.uag.zer0.entity.work.Tag
import com.uag.zer0.entity.work.Work
import com.uag.zer0.generated.model.ApiImgs
import com.uag.zer0.generated.model.ApiTags
import com.uag.zer0.generated.model.ApiWorks
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class WorkMapper {

    fun toWork(apiWorks: ApiWorks): Work {
        return Work(
            workId = apiWorks.workId ?: 0,
            genre = apiWorks.genre?.joinToString(", ") ?: "",
            format = apiWorks.format?.joinToString(", ") ?: "",
            mainTitle = apiWorks.mainTitle ?: "",
            subTitle = apiWorks.subTitle ?: "",
            description = apiWorks.description ?: "",
            workSize = apiWorks.workSize?.removeSuffix("MB")?.toIntOrNull()
                ?: 0,
            pages = apiWorks.pages?.toIntOrNull() ?: 0,
            titleImgUrl = apiWorks.titleImageUrl ?: "",
            likes = apiWorks.likes ?: 0,
            downloads = apiWorks.downloads ?: 0,
            createdAt = apiWorks.createdAt?.toInstant() ?: Instant.now(),
            updatedAt = apiWorks.updatedAt?.toInstant() ?: Instant.now()
        )
    }

    fun toImg(apiImgs: ApiImgs, workId: Int): Img {
        return Img(
            workId = workId,
            imgUrl = apiImgs.imgUrl ?: ""
        )
    }

    fun toTag(apiTags: ApiTags): Tag {
        return Tag(

        )
    }
}