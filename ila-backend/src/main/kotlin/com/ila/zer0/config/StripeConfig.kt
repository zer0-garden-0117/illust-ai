package com.ila.zer0.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class StripeConfig(
    @Value("\${stripe.apiKey:sk_test_xxx}") private val stripeApiKey: String,
    @Value("\${stripe.priceId.light:price_xxx}") private val lightPriceId: String,
    @Value("\${stripe.priceId.basic:price_xxx}") private val basicPriceId: String,
    @Value("\${stripe.priceId.pro:price_xxx}") private val proPriceId: String,
    @Value("\${stripe.priceId.unlimited:price_xxx}") private val unlimitedPriceId: String,
    @Value("\${stripe.url.success:http://}") private val stripeSuccessUrl: String,
    @Value("\${stripe.url.cancel:http://}") private val stripeCancelUrl: String,
    @Value("\${stripe.url.return:http://}") private val stripeReturnUrl: String,
) {
    @Bean
    fun stripeApiKey(): String {
        return stripeApiKey
    }

    @Bean
    fun lightPriceId(): String {
        return lightPriceId
    }

    @Bean
    fun basicPriceId(): String {
        return basicPriceId
    }

    @Bean
    fun proPriceId(): String {
        return proPriceId
    }

    @Bean
    fun unlimitedPriceId(): String {
        return unlimitedPriceId
    }

    @Bean
    fun stripeSuccessUrl(): String {
        return stripeSuccessUrl
    }

    @Bean
    fun stripeCancelUrl(): String {
        return stripeCancelUrl
    }

    @Bean
    fun stripeReturnUrl(): String {
        return stripeReturnUrl
    }
}