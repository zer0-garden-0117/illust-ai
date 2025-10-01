package com.ila.zer0.controller

import com.ila.zer0.config.token.CustomAuthenticationToken
import com.ila.zer0.generated.endpoint.BillingsApi
import com.ila.zer0.generated.model.*
import com.ila.zer0.service.StripeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
class BillingsController(
    private val stripeService: StripeService
) : BillingsApi {

    override fun createCheckoutSession(
        @RequestBody apiBilling: ApiBilling
    ): ResponseEntity<ApiBilling> {
        val userId =
            getUserId() ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
        val userName = getUserName()
        val url = stripeService.createCheckoutSessionUrl(userId, userName, apiBilling.plan)
        val response = ApiBilling().apply {
            this.plan = apiBilling.plan
            this.checkoutSessionUrl = url
        }
        return ResponseEntity.ok(response)
    }

    override fun createPortalSession(
        @RequestBody apiBilling: ApiBilling
    ): ResponseEntity<ApiBilling> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    override fun stripeWebhook(
        @RequestBody body: kotlin.Any
    ): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }

    private fun getUserId(): String? {
        val authentication: Authentication? =
            SecurityContextHolder.getContext().authentication
        val customAuth = authentication as? CustomAuthenticationToken
        return customAuth?.userId
    }

    private fun getUserName(): String? {
        val authentication: Authentication? =
            SecurityContextHolder.getContext().authentication
        val customAuth = authentication as? CustomAuthenticationToken
        return customAuth?.userName
    }
}