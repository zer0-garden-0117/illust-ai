package com.uag.zer0.mapper.work

import com.uag.zer0.entity.work.Work
import com.uag.zer0.generated.model.ApiImgsInner
import com.uag.zer0.generated.model.ApiTagsListInner
import com.uag.zer0.generated.model.ApiWorks
import com.uag.zer0.generated.model.ApiWorksWithDetails
import org.springframework.stereotype.Component

@Component
class WorkMapper {

    fun toApiWorksWithDetails(
        work: Work?,
        tagNameList: List<String?>,
        imageList: List<String?>
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

        // タグのリストをApiTagsListInnerのリストに変換
        val apiTagsList = tagNameList.filterNotNull().map { tagName ->
            ApiTagsListInner(
                tagId = tagName.hashCode(),  // タグ名のハッシュコードをタグIDとして使用
                tagName = tagName
            )
        }

        // 画像のリストをApiImgsInnerのリストに変換
        val apiImgsList =
            imageList.filterNotNull().mapIndexed { index, imgUrl ->
                ApiImgsInner(
                    imgId = index + 1,  // インデックスを画像IDとして使用
                    imgPageNum = index + 1,  // ページ番号をインデックスに基づいて設定
                    imgUrl = imgUrl
                )
            }

        // ApiWorksWithDetailsオブジェクトを返す
        return ApiWorksWithDetails(
            apiWorks = apiWorks,
            apiImgsList = apiImgsList,
            apiTagsList = apiTagsList
        )
    }
}