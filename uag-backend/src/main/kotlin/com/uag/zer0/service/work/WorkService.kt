package com.uag.zer0.service.work

import com.uag.zer0.entity.work.Work
import com.uag.zer0.repository.tag.TagRepository
import com.uag.zer0.repository.work.WorkRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class WorkService(
    private val workRepository: WorkRepository,
    private val tagRepository: TagRepository
) {

    private val logger = LoggerFactory.getLogger(WorkService::class.java)

    private fun searchWorksByGenre(genres: List<String>): List<Work> {
        val results = mutableListOf<Work>()
        genres.forEach { genre ->
            val works = workRepository.findByGenre(genre)
            works.forEach { work ->
                results.add(work)
            }
        }
        logger.info(results.toString())
        return results
    }

    private fun searchWorksByFormat(formats: List<String>): List<Work> {
        val results = mutableListOf<Work>()
        formats.forEach { format ->
            val works = workRepository.findByFormat(format)
            works.forEach { work ->
                results.add(work)
            }
        }
        logger.info(results.toString())
        return results
    }

    private fun searchWorksByTag(tags: List<String>): List<Work> {
        logger.info(tags.toString())
        val results = mutableListOf<Work>()
        tags.forEach { tag ->
            val workIds = tagRepository.findWorkIdsByTag(tag)
            workIds.forEach { workId ->
                results.add(workRepository.findByWorkId(workId))
            }
        }
        logger.info(results.toString())
        return results
    }

    fun findWorksByFreeWords(words: List<String>): List<Work> {
        val works = mutableListOf<Work>()
        // フォーマット検索
        searchWorksByFormat(words).forEach { work ->
            works.add(work)
        }
        // ジャンル検索
        searchWorksByGenre(words).forEach { work ->
            works.add(work)
        }
        // タグ検索
        searchWorksByTag(words).forEach { work ->
            works.add(work)
        }
        // メインタイトル検索(ToDo)
        // サブタイトル検索(ToDo)
        // 説明検索(ToDo)
        return works.distinct()
    }

    fun findWorksByTagWords(words: List<String>): List<Work> {
        val works = mutableListOf<Work>()
        // タグ検索
        searchWorksByTag(words).forEach { work ->
            works.add(work)
        }
        return works.distinct()
    }

    fun findWorkByWorkId(workId: String): Work {
        val work = workRepository.findByWorkId(workId)
        logger.info(work.toString())
        return work
    }

//    // 指定したworkIdに紐づく作品情報、作品の画像のリスト、タグのマップを取得
//    fun getWorkById(workId: String): ApiWorksWithDetails {
//        // 作品情報の取得
//        val work: Work? = workRepository.findByWorkId(workId)
//        logger.info(work.toString())
//        // 作品の画像情報の取得
//        val imageList = workByPageRepository.findByWorkByPageIdWorkId(workId)
//            .map { it.s3Url }
//        // タグ名のリストを取得
//        val tagNameList = workByTagRepository.findByWorkByTagIdWorkId(workId)
//            .map { it.workByTagId?.tagName }
//        // タグ名に対応するカテゴリ情報のリストを取得
//        val tagByCategoryList =
//            tagByCategoryRepository.findByTagByCategoryIdTagNameIn(tagNameList.filterNotNull())
//        // カテゴリ名をキー、タグ名のリストを値とするマップを生成
//        val categoryNameToTagNameMap =
//            tagByCategoryList.groupBy { it.tagByCategoryId?.categoryName }
//                .mapValues { entry -> entry.value.map { it.tagByCategoryId?.tagName } }
//        val response =
//            workMapper.toApiWorksWithDetails(
//                work,
//                imageList,
//                categoryNameToTagNameMap
//            )
//        logger.info(response.toString())
//        return response
//    }
//
//    fun searchWorksByTags(words: List<String>?): List<Work> {
//        // 空のリストやnullチェック
//        if (words.isNullOrEmpty()) {
//            return emptyList()
//        }
//
//        // 各単語でタグ検索
//        val workIds = mutableListOf<String>()
//        words.forEach { word ->
//            val tagByWorks = tagByWorkRepository.findByTagByWorkIdTagName(word)
//            tagByWorks.forEach { tagByWork ->
//                tagByWork.workId?.let { workIds.add(it) }
//            }
//        }
//        val uniqueWorkIds = workIds.distinct()
//
//        // 作品IDで作品情報を取得
//        val works = mutableListOf<Work>()
//        uniqueWorkIds.forEach { workId ->
//            val work = workRepository.findByWorkId(workId)
//            if (work != null) {
//                works.add(work)
//                logger.info(work.toString())
//            }
//        }
//        return works
//    }
//
//    fun searchWorksByFreeWords(words: List<String>?): List<Work> {
//        // 空のリストやnullチェック
//        if (words.isNullOrEmpty()) {
//            return emptyList()
//        }
//
//        // 各単語でフリーワード検索
//        val workIds = mutableListOf<String>()
//        words.forEach { word ->
//            // 部分一致でタグ検索
//            val tagByWorks =
//                tagByWorkRepository.findByTagByWorkIdTagName(word)
//            tagByWorks.forEach { tagByWork ->
//                tagByWork.workId?.let { workIds.add(it) }
//            }
//        }
//        val uniqueWorkIds = workIds.distinct()
//
//        // 作品IDで作品情報を取得
//        val works = mutableListOf<Work>()
//        uniqueWorkIds.forEach { workId ->
//            val work = workRepository.findByWorkId(workId)
//            if (work != null) {
//                works.add(work)
//                logger.info(work.toString())
//            }
//        }
//        return works
//    }
}