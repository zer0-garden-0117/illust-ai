package com.ila.zer0.service.work

import com.ila.zer0.dto.WorksWithSearchResult
import com.ila.zer0.entity.Work
import com.ila.zer0.repository.WorkRepository
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

    fun findWorksByUserId(userId: String): List<Work> {
        return workRepository.findByUserId(userId)
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

    fun updateWork(work: Work): Work {
        return workRepository.updateWork(work)
    }

    fun deleteWorkById(workId: String) {
        return workRepository.deleteWorkById(workId)
    }

    fun addLikedToWork(workId: String): Work {
        return workRepository.addLikes(workId)
    }

    fun deleteLikedToWork(workId: String): Work {
        return workRepository.deleteLikes(workId)
    }

    fun addRatingToWork(workId: String, oldRate: Int?, newRate: Int): Work {
        return workRepository.addRating(workId, oldRate,newRate)
    }

    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByUserIdWithOffset(
        userId: String,
        offset: Int,
        limit: Int,
        userWorksFilterType: String
    ): WorksWithSearchResult {
        val works = workRepository.findByUserId(userId)

        // userWorksFilterTypeに応じてstatusでフィルタリング(allの時はそのまま)
        val worksWithStatus = when (userWorksFilterType) {
            // postedの時はpostedのみ抽出
            "posted" -> works.filter { it.status == "posted" }
            // createdの時はcreated、creatingのみ抽出
            "created" -> works.filter { it.status == "created" || it.status == "creating" }
            else -> works
        }

        // worksの順番を更新日時の降順にソート
        val sortedWorks = worksWithStatus.sortedByDescending { it.updatedAt }

        // offsetで指定した件数分スキップしlimit分だけ取得
        val filteredWorks = sortedWorks.drop(offset).take(limit)
        return WorksWithSearchResult(
            works = filteredWorks,
            totalCount = worksWithStatus.size
        )
    }
}