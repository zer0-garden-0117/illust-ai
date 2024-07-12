package com.uag.zer0.repository

import com.uag.zer0.entity.Work
import org.socialsignin.spring.data.dynamodb.repository.EnableScan
import org.springframework.data.repository.CrudRepository

@EnableScan
interface WorkRepository : CrudRepository<Work, String> {
    fun findByCategory(category: String): List<Work>
    fun findBySubject(subject: String): List<Work>
    fun findByTitle(title: String): List<Work>
    fun findByCreator(creator: String): List<Work>
    fun findByLanguage(language: String): List<Work>
    fun findByLikes(likes: Int): List<Work>
    fun findByDownloads(downloads: Int): List<Work>
}