package com.ila.zer0.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration

@Configuration
class StripeConfig(
    @Value("\${stripe.apiKey:sk_test_xxx}") val stripeApiKey: String,
    @Value("\${stripe.priceId.basic:price_xxx}") val basicPriceId: String,
    @Value("\${stripe.priceId.boost:price_xxx}") val boostPriceId: String,
    @Value("\${stripe.priceId.boost2x:price_xxx}") val boost2xPriceId: String,
    @Value("\${stripe.url.success:http://}") val stripeSuccessUrl: String,
    @Value("\${stripe.url.cancel:http://}") val stripeCancelUrl: String,
    @Value("\${stripe.url.return:http://}") val stripeReturnUrl: String,
) {

}