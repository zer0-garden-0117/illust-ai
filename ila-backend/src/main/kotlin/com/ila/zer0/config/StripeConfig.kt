package com.ila.zer0.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration

@Configuration
class StripeConfig(
    @Value("\${stripe.apiKey:sk_test_xxx}") val stripeApiKey: String,
    @Value("\${stripe.priceId.basic:price_xxx}") val basicPriceId: String,
    @Value("\${stripe.priceId.boosts:price_xxx}") val boostSPriceId: String,
    @Value("\${stripe.priceId.boostm:price_xxx}") val boostMPriceId: String,
    @Value("\${stripe.priceId.boostl:price_xxx}") val boostLPriceId: String,
    @Value("\${stripe.planUrl.success:http://}") val stripeSuccessPlanUrl: String,
    @Value("\${stripe.planUrl.cancel:http://}") val stripeCancelPlanUrl: String,
    @Value("\${stripe.planUrl.return:http://}") val stripeReturnPlanUrl: String,
    @Value("\${stripe.boostUrl.success:http://}") val stripeSuccessBoostUrl: String,
    @Value("\${stripe.boostUrl.cancel:http://}") val stripeCancelBoostUrl: String,
) {

}