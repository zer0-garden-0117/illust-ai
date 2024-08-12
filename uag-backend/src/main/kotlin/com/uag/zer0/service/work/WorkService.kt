package com.uag.zer0.service.work

import com.uag.zer0.entity.work.Work
import com.uag.zer0.generated.model.ApiWorksWithDetails
import com.uag.zer0.mapper.work.WorkMapper
import com.uag.zer0.repository.tag.TagByCategoryRepository
import com.uag.zer0.repository.tag.TagByWorkRepository
import com.uag.zer0.repository.work.WorkByPageRepository
import com.uag.zer0.repository.work.WorkByTagRepository
import com.uag.zer0.repository.work.WorkRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service


@Service
class WorkService(
    private val workRepository: WorkRepository,
    private val workByPageRepository: WorkByPageRepository,
    private val workByTagRepository: WorkByTagRepository,
    private val tagByCategoryRepository: TagByCategoryRepository,
    private val tagByWorkRepository: TagByWorkRepository,
    private val workMapper: WorkMapper
) {

    private val logger = LoggerFactory.getLogger(WorkService::class.java)

    // 指定したworkIdに紐づく作品情報、作品の画像のリスト、タグのマップを取得
    fun getWorkById(workId: String): ApiWorksWithDetails {
        // 作品情報の取得
        val work: Work? = workRepository.findByWorkId(workId)
        // 作品の画像情報の取得
        val imageList = workByPageRepository.findByWorkByPageIdWorkId(workId)
            .map { it.s3Url }
        // タグ名のリストを取得
        val tagNameList = workByTagRepository.findByWorkByTagIdWorkId(workId)
            .map { it.workByTagId?.tagName }
        // タグ名に対応するカテゴリ情報のリストを取得
        val tagByCategoryList =
            tagByCategoryRepository.findByTagByCategoryIdTagNameIn(tagNameList.filterNotNull())
        // カテゴリ名をキー、タグ名のリストを値とするマップを生成
        val categoryNameToTagNameMap =
            tagByCategoryList.groupBy { it.tagByCategoryId?.categoryName }
                .mapValues { entry -> entry.value.map { it.tagByCategoryId?.tagName } }
        val response =
            workMapper.toApiWorksWithDetails(
                work,
                imageList,
                categoryNameToTagNameMap
            )
        return response
    }

    fun searchWorksByWords(words: List<String>?): List<String> {
        // 空のリストやnullチェック
        if (words.isNullOrEmpty()) {
            return emptyList()
        }

        // 結果を格納するリスト
        val results = mutableListOf<String>()

        // 各単語で検索
        words.forEach { word ->
            val res =
                tagByWorkRepository.findByTagByWorkIdTagNameContaining(word)
            results.add(res.toString())
        }

        // 結果を処理する（例：重複を削除するなど）
        val uniqueResults = results.distinct()

        // 結果を返す
        return uniqueResults
    }
}