package com.uag.zer0.entity

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "images")
data class Image(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "s3_url", nullable = false)
    val s3Url: String,

    @Column(name = "created_at")
    val createdAt: LocalDateTime? = LocalDateTime.now(),

    @Column(name = "updated_at")
    val updatedAt: LocalDateTime? = LocalDateTime.now()
)