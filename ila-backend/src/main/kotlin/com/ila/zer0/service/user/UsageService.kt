package com.ila.zer0.service.user

import com.ila.zer0.entity.Usage
import com.ila.zer0.repository.UsageRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Service
class UsageService(
    private val usageRepository: UsageRepository,
) {
    private val zoneId = ZoneId.of("Asia/Tokyo")
    private val dateFormatter = DateTimeFormatter.BASIC_ISO_DATE // yyyymmdd

    fun findToday(userId: String): Usage? {
        val sk = todaySk()
        return usageRepository.findByKey(userId, sk)
    }

    fun getRemainingToday(userId: String, defaultLimit: Int = 3): Int {
        val sk = todaySk()
        return usageRepository.getRemaining(userId, sk, defaultLimit)
    }

    fun consumeOneToday(
        userId: String,
        limitIfAbsent: Int,
        ttlDays: Long = 35
    ): Int {
        val sk = todaySk()
        val ttlEpochSeconds = ttlEpoch(ttlDays)
        return usageRepository.consumeOne(
            userId = userId,
            yyyymmdd = sk,
            limitIfAbsent = limitIfAbsent,
            ttlEpochSeconds = ttlEpochSeconds
        )
    }

    private fun todaySk(): String {
        val today = LocalDate.now(zoneId)
        return today.format(dateFormatter) // yyyymmdd
    }

    /**
     * TTL は「today + ttlDays の 00:00(JST)」を epoch 秒で返す。
     * 例: ttlDays=35 の場合、約5週間後の0時に自動削除対象。
     */
    private fun ttlEpoch(ttlDays: Long): Long {
        val date = LocalDate.now(zoneId).plusDays(ttlDays)
        return date.atStartOfDay(zoneId).toEpochSecond()
    }
}