package com.ila.zer0.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource

@Configuration
class FirebaseConfig {

    @Bean
    fun firebaseAuth(): FirebaseAuth {
        // サービスアカウントキーから直接初期化
        val serviceAccount = ClassPathResource("firebase-service-account.json").inputStream
        val credentials = GoogleCredentials.fromStream(serviceAccount)

        // オプション設定なしで十分
        val options = FirebaseOptions.builder()
            .setCredentials(credentials)
            .build()

        FirebaseApp.initializeApp(options)
        return FirebaseAuth.getInstance()
    }
}