package com.ila.zer0.service

import com.ila.zer0.config.StripeConfig
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
    private val stripeConfig: StripeConfig
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    init {
        Stripe.apiKey = stripeConfig.stripeApiKey
    }

    fun createCheckoutSessionUrl(
        userId: String,
        userName: String?,
        product: String?,
        productType: String?,
    ): String {
        val customer = getOrCreateCustomer(userId, userName)
        val priceId = toPriceId(product)
        val mode = toCheckoutMode(productType)
        val params = baseCheckoutParams(
            mode = mode,
            priceId = priceId,
            successUrl = "${stripeConfig.stripeSuccessUrl}?session_id={CHECKOUT_SESSION_ID}",
            cancelUrl = stripeConfig.stripeCancelUrl,
            customerId = customer.id,
            metadata = mapOf("app_user_id" to userId)
        )
        val idempotencyKey = "chk_${userId}_${product}_${mode.name.lowercase()}_${Instant.now().epochSecond}"
        val requestOptions = RequestOptions.builder()
            .setIdempotencyKey(idempotencyKey)
            .build()
        val session = Session.create(params, requestOptions)
        log.info("Created Checkout Session: id=${session.id}, url=${session.url}, customer=${customer.id}")
        return session.url
    }

    private fun toCheckoutMode(productType: String?): SessionCreateParams.Mode =
        when (productType) {
            "subscription" -> SessionCreateParams.Mode.SUBSCRIPTION
            "one-time"     -> SessionCreateParams.Mode.PAYMENT
            else -> throw IllegalArgumentException("Invalid product type: $productType")
        }

    private fun toPriceId(product: String?): String =
        when (product) {
            "basic"   -> stripeConfig.basicPriceId
            "boost"   -> stripeConfig.boostPriceId
            "boost2x" -> stripeConfig.boost2xPriceId
            else -> throw IllegalArgumentException("Invalid product: $product")
        }

    private fun baseCheckoutParams(
        mode: SessionCreateParams.Mode,
        priceId: String,
        successUrl: String,
        cancelUrl: String,
        customerId: String,
        metadata: Map<String, String>
    ): SessionCreateParams {
        return SessionCreateParams.builder()
            .setMode(mode)
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setPrice(priceId)
                    .setQuantity(1L)
                    .build()
            )
            .setSuccessUrl(successUrl)
            .setCancelUrl(cancelUrl)
            .setCustomer(customerId)
            .putAllMetadata(metadata)
            .build()
    }

    fun createPortalSessionUrl(
        userId: String,
        userName: String?,
    ): String {
        val customer = getOrCreateCustomer(userId, userName)

        val params = PortalSessionCreateParams.builder()
            .setCustomer(customer.id)
            .setReturnUrl(stripeConfig.stripeReturnUrl)
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