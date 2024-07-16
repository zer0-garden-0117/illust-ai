package com.uag.zer0.service.work

import com.uag.zer0.entity.work.Work
import com.uag.zer0.generated.model.ApiWorksWithDetails
import com.uag.zer0.mapper.work.WorkMapper
import com.uag.zer0.repository.tag.TagByCategoryRepository
import com.uag.zer0.repository.work.WorkByPageRepository
import com.uag.zer0.repository.work.WorkByTagRepository
import com.uag.zer0.repository.work.WorkRepository
import org.springframework.stereotype.Service


@Service
class WorkService(
    private val workRepository: WorkRepository,
    private val workByPageRepository: WorkByPageRepository,
    private val workByTagRepository: WorkByTagRepository,
    private val tagByCategoryRepository: TagByCategoryRepository,
    private val workMapper: WorkMapper
) {

    fun getWorkById(workId: String): ApiWorksWithDetails {
        val work: Work? = workRepository.findByWorkId(workId)
        val imageList = workByPageRepository.findByWorkByPageIdWorkId(workId)
            .map { it.s3Url }
        val tagNameList = workByTagRepository.findByWorkByTagIdWorkId(workId)
            .map { it.workByTagId?.tagName }
        val tagByCategoryList =
            tagByCategoryRepository.findByTagByCategoryIdTagNameIn(tagNameList as List<String>)
        val tagNameToCategoryMap =
            tagByCategoryList.associate { it.tagByCategoryId?.tagName to it.tagByCategoryId?.categoryName }
        val response =
            workMapper.toApiWorksWithDetails(work, tagNameList, imageList)
        return response
    }
}