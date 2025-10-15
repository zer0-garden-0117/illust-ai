package com.ila.zer0.service.user

import com.ila.zer0.entity.Product
import com.ila.zer0.repository.ProductRepository
import org.springframework.stereotype.Service
import java.time.*
import java.time.format.DateTimeFormatter
import java.util.UUID

@Service
class ProductService(
    private val productRepository: ProductRepository,
) {
    private val zoneId = ZoneId.of("Asia/Tokyo")
    private val supportToFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd")                 // 例: 2025/11/11
    private val expiresKeyFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX")  // 例: 2025-11-11T23:59:59+09:00

    /**
     * Product を 1 件登録します。
     * @param userId ユーザーID(PK)
     * @param product "Product S" / "Product M" / "Product L"
     * @param supportTo "yyyy/MM/dd" 形式の有効期限（JST基準、当日 23:59:59 を期限にします）
     */
    fun putProduct(userId: String, product: String, supportTo: String): Product {
        val endOfDay = LocalDate.parse(supportTo, supportToFormatter)
            .atTime(23, 59, 59)
            .atZone(zoneId)

        val ttlEpoch = endOfDay.toEpochSecond()
        val expiresKey = "${endOfDay.format(expiresKeyFormatter)}#${UUID.randomUUID()}"

        val item = Product(
            userId = userId,
            expiresKey = expiresKey,
            ttl = ttlEpoch,
            product = product,
            createdAt = ZonedDateTime.now(ZoneOffset.UTC).toString()
        )
        return productRepository.putProduct(item)
    }

    /**
     * 現在以降に有効な Product を期限昇順で取得します。
     */
    fun findActive(userId: String): List<Product> {
        val nowKey = ZonedDateTime.now(zoneId).format(expiresKeyFormatter)
        return productRepository.findActiveSince(userId, nowKey)
    }

    /**
     * ユーザーの全 Product を期限昇順で取得（limit 指定可）
     */
    fun listAll(userId: String, limit: Int? = null): List<Product> {
        return productRepository.listAllByUser(userId, limit)
    }

    /**
     * 指定キーの Product を削除
     */
    fun deleteByKey(userId: String, expiresKey: String): Product {
        return productRepository.deleteByKey(userId, expiresKey)
    }
}