package com.ila.zer0.service

import com.stripe.Stripe
import com.stripe.model.Customer
import com.stripe.model.CustomerSearchResult
import com.stripe.model.checkout.Session
import com.stripe.model.billingportal.Session as PortalSession
import com.stripe.net.RequestOptions
import com.stripe.param.CustomerCreateParams
import com.stripe.param.CustomerSearchParams
import com.stripe.param.checkout.SessionCreateParams
import com.stripe.param.billingportal.SessionCreateParams as PortalSessionCreateParams
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class StripeService(
    private val stripeApiKey: String,
    private val lightPriceId: String,
    private val basicPriceId: String,
    private val proPriceId: String,
    private val unlimitedPriceId: String,
    private val stripeSuccessUrl: String,
    private val stripeCancelUrl: String,
    private val stripeReturnUrl: String
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    init {
        Stripe.apiKey = stripeApiKey
    }

    fun createCheckoutSessionUrl(
        userId: String,
        userName: String?,
        plan: String?
    ): String {

        val customer = getOrCreateCustomer(userId, userName)
        val priceId = when (plan) {
            "light" -> lightPriceId
            "basic" -> basicPriceId
            "pro" -> proPriceId
            "unlimited" -> unlimitedPriceId
            else -> throw IllegalArgumentException("Invalid plan: $plan")
        }

        val params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPrice(priceId)
                    .build()
            )
            .setSuccessUrl("$stripeSuccessUrl?session_id={CHECKOUT_SESSION_ID}")
            .setCancelUrl(stripeCancelUrl)
            .setCustomer(customer.id)
            .putAllMetadata(mapOf("app_user_id" to userId))
            .build()

        val idempotencyKey = "chk_${userId}_${plan}_${Instant.now().epochSecond}"
        val requestOptions = RequestOptions.builder()
            .setIdempotencyKey(idempotencyKey)
            .build()

        val session = Session.create(params, requestOptions)
        log.info("Created Checkout Session: id=${session.id}, url=${session.url}, customer=${customer.id}")
        return session.url
    }

    fun createPortalSessionUrl(
        userId: String,
        userName: String?,
    ): String {
        val customer = getOrCreateCustomer(userId, userName)

        val params = PortalSessionCreateParams.builder()
            .setCustomer(customer.id)
            .setReturnUrl(stripeReturnUrl)
            .build()

        val portal = PortalSession.create(params)
        log.info("Created Portal Session: url=${portal.url}, customer=${customer.id}")
        return portal.url
    }

    fun getOrCreateCustomer(userId: String, userName: String?): Customer {
        findCustomerByAppUserId(userId)?.let { return it }

        val createParams = CustomerCreateParams.builder()
            .setName(userName)
            .setMetadata(mapOf("app_user_id" to userId))
            .build()

        val created = Customer.create(createParams)
        log.info("Created Stripe Customer: id=${created.id} for app_user_id=$userId")
        return created
    }

    private fun findCustomerByAppUserId(userId: String): Customer? {
        val query = "metadata['app_user_id']:'$userId'"
        val params = CustomerSearchParams.builder().setQuery(query).build()
        val result: CustomerSearchResult = Customer.search(params)
        val customer = result.data.firstOrNull()
        if (customer != null) {
            log.debug("Found existing customer ${customer.id} for app_user_id=$userId")
        }
        return customer
    }
}