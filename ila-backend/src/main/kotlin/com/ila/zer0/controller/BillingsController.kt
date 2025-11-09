package com.ila.zer0.controller

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.generated.endpoint.BillingsApi
import com.ila.zer0.generated.model.*
import com.ila.zer0.service.StripeService
import com.ila.zer0.service.user.UserManagerService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
class BillingsController(
    private val stripeService: StripeService,
    private val userManagerService: UserManagerService
) : BillingsApi {

    override fun createCheckoutSession(
        @RequestBody apiBilling: ApiBilling
    ): ResponseEntity<ApiBilling> {
        // 認証ユーザーを取得
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // チェックアウトセッションURLを作成
        val user = userManagerService.getUserById(userId)
        val url = stripeService.createCheckoutSessionUrl(userId, user?.userName, apiBilling.product, apiBilling.productType)

        // レスポンスを作成
        val response = ApiBilling().apply {
            this.product = apiBilling.product
            this.checkoutSessionUrl = url
        }
        return ResponseEntity.ok(response)
    }

    override fun createPortalSession(
        @RequestBody apiBilling: ApiBilling
    ): ResponseEntity<ApiBilling> {
        // 認証ユーザーを取得
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)

        // ポータルセッションURLを作成
        val user = userManagerService.getUserById(userId)
        val url = stripeService.createPortalSessionUrl(userId, user?.userName)

        // レスポンスを作成
        val response = ApiBilling().apply {
            this.portalSessionUrl = url
        }
        return ResponseEntity.ok(response)
    }

    private fun getUserId(): String? {
        val authentication: Authentication? =
            SecurityContextHolder.getContext().authentication
        val customAuth = authentication as? CustomAuthenticationToken
        return customAuth?.userId
    }
}