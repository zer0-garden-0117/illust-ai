package com.uag.zer0.mapper.work

import com.uag.zer0.entity.work.Work
import com.uag.zer0.generated.model.ApiImgsInner
import com.uag.zer0.generated.model.ApiTagsMap
import com.uag.zer0.generated.model.ApiWorks
import com.uag.zer0.generated.model.ApiWorksWithDetails
import org.springframework.stereotype.Component

@Component
class WorkMapper {

    fun toApiWorksWithDetails(
        work: Work?,
        imageList: List<String?>,
        categoryNameToTagNameMap: Map<String?, List<String?>>
    ): ApiWorksWithDetails {
        // workオブジェクトがnullの場合は空のApiWorksを返す
        val apiWorks = work?.let {
            ApiWorks(
                workId = it.workId.toInt(),
                mainTitle = it.mainTitle,
                subTitle = it.subTitle,
                description = it.description,
                pages = it.pages,
                workSize = it.workSize,
                likes = it.likes,
                downloads = it.downloads,
                titleImageUrl = it.titleImageUrl
            )
        } ?: ApiWorks()

        // 画像のリストをApiImgsInnerのリストに変換
        val apiImgsList =
            imageList.filterNotNull().mapIndexed { index, imgUrl ->
                ApiImgsInner(
                    imgId = index + 1,  // インデックスを画像IDとして使用
                    imgPageNum = index + 1,  // ページ番号をインデックスに基づいて設定
                    imgUrl = imgUrl
                )
            }

        // カテゴリ名をキー、タグ名を値とするマップをApiTagsMapオブジェクトに変換
        val apiTagsMap = ApiTagsMap(
            workFormat = categoryNameToTagNameMap["workFormat"]?.filterNotNull(),
            topicGenre = categoryNameToTagNameMap["topicGenre"]?.filterNotNull(),
            characterName = categoryNameToTagNameMap["characterName"]?.filterNotNull(),
            creator = categoryNameToTagNameMap["creator"]?.filterNotNull(),
            language = categoryNameToTagNameMap["language"]?.filterNotNull(),
            other = categoryNameToTagNameMap["other"]?.filterNotNull()
        )

        // ApiWorksWithDetailsオブジェクトを返す
        return ApiWorksWithDetails(
            apiWorks = apiWorks,
            apiImgsList = apiImgsList,
            apiTagsMap = apiTagsMap
        )
    }
}