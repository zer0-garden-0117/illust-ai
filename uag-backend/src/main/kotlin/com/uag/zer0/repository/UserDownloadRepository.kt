package com.uag.zer0.repository

import com.uag.zer0.entity.UserDownload
import com.uag.zer0.entity.UserDownloadId
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface UserDownloadRepository :
    CrudRepository<UserDownload, UserDownloadId> {
    fun findByUserDownloadIdUserId(userId: String): List<UserDownload>
    fun findByUserDownloadIdWorkId(workId: String): List<UserDownload>
}