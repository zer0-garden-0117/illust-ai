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
import java.time.ZoneId
import java.time.format.DateTimeFormatter

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
        val successUrl = toSuccessUrl(productType)
        val cancelUrl = toCancelUrl(productType)
        val isPlan = isPlan(priceId)
        val params = baseCheckoutParams(
            mode = mode,
            priceId = priceId,
            successUrl = "${successUrl}?priceId=$priceId",
            cancelUrl = cancelUrl,
            customerId = customer.id,
            appUserId = userId,
            isPlan = isPlan,
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

    private fun toSuccessUrl(productType: String?): String =
        when (productType) {
            "subscription" -> stripeConfig.stripeSuccessPlanUrl
            "one-time"     -> stripeConfig.stripeSuccessBoostUrl
            else -> throw IllegalArgumentException("Invalid product type: $productType")
        }

    private fun toCancelUrl(productType: String?): String =
        when (productType) {
            "subscription" -> stripeConfig.stripeCancelPlanUrl
            "one-time"     -> stripeConfig.stripeCancelBoostUrl
            else -> throw IllegalArgumentException("Invalid product type: $productType")
        }

    private fun toPriceId(product: String?): String =
        when (product) {
            "basic"   -> stripeConfig.basicPriceId
            "boosts"   -> stripeConfig.boostSPriceId
            "boostm" -> stripeConfig.boostMPriceId
            "boostl" -> stripeConfig.boostLPriceId
            else -> throw IllegalArgumentException("Invalid product: $product")
        }

    fun toProduct(priceId: String): String =
        when (priceId) {
            stripeConfig.basicPriceId -> "Basic"
            stripeConfig.boostSPriceId -> "Boost S"
            stripeConfig.boostMPriceId -> "Boost M"
            stripeConfig.boostLPriceId -> "Boost L"
            else -> throw IllegalArgumentException("Invalid priceId: $priceId")
        }

    fun isPlan(priceId: String): Boolean =
        priceId == stripeConfig.basicPriceId

    // 現在日時からサポート日時を算出する
    // boostS: 7日, boostM: 30日, boostL: 30日
    // 返却は2025/01/01の形式
    fun calSupportTo(priceId: String): String {
        val formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd")
            .withZone(ZoneId.of("Asia/Tokyo"))
        val now = Instant.now()
        val supportTo = when (priceId) {
            stripeConfig.boostSPriceId -> now.plusSeconds(7 * 24 * 60 * 60)
            stripeConfig.boostMPriceId -> now.plusSeconds(30 * 24 * 60 * 60)
            stripeConfig.boostLPriceId -> now.plusSeconds(30 * 24 * 60 * 60)
            else -> throw IllegalArgumentException("Invalid priceId: $priceId")
        }
        return formatter.format(supportTo)
    }

    private fun baseCheckoutParams(
        mode: SessionCreateParams.Mode,
        priceId: String,
        successUrl: String,
        cancelUrl: String,
        customerId: String,
        appUserId: String,
        isPlan: Boolean,
    ): SessionCreateParams {
        val b = SessionCreateParams.builder()
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

        if (mode == SessionCreateParams.Mode.SUBSCRIPTION) {
            b.setSubscriptionData(
                SessionCreateParams.SubscriptionData.builder()
                    .putMetadata("app_user_id", appUserId)
                    .putMetadata("app_price_id", priceId)
                    .putMetadata("is_plan", isPlan.toString())
                    .build()
            )
        } else if (mode == SessionCreateParams.Mode.PAYMENT) {
            b.setPaymentIntentData(
                SessionCreateParams.PaymentIntentData.builder()
                    .putMetadata("app_user_id", appUserId)
                    .putMetadata("app_price_id", priceId)
                    .putMetadata("is_plan", isPlan.toString())
                    .build()
            )
        }
        return b.build()
    }

    fun createPortalSessionUrl(
        userId: String,
        userName: String?,
    ): String {
        val customer = getOrCreateCustomer(userId, userName)

        val params = PortalSessionCreateParams.builder()
            .setCustomer(customer.id)
            .setReturnUrl(stripeConfig.stripeReturnPlanUrl)
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