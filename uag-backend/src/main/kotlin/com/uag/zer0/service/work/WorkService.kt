package com.uag.zer0.service.work

import com.uag.zer0.entity.Work
import com.uag.zer0.repository.WorkRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class WorkService(
    private val workRepository: WorkRepository,
) {

    private val logger = LoggerFactory.getLogger(WorkService::class.java)

    fun findWorkById(workId: String): Work {
        return workRepository.findByWorkId(workId)
    }

    fun findWorksByIds(workIds: List<String>): List<Work> {
        val works = mutableListOf<Work>()
        workIds.forEach { workId ->
            works.add(workRepository.findByWorkId(workId))
        }
        return works
    }

    fun registerWork(work: Work): Work {
        return workRepository.registerWork(work)
    }

    fun deleteWorkById(workId: String) {
        return workRepository.deleteWorkById(workId)
    }
}