//package com.uag.zer0.config
//
//import org.json.JSONObject
//import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory
//import org.springframework.boot.web.server.Ssl
//import org.springframework.boot.web.servlet.server.ServletWebServerFactory
//import org.springframework.context.annotation.Bean
//import org.springframework.context.annotation.ComponentScan
//import org.springframework.context.annotation.Configuration
//import org.springframework.context.annotation.Profile
//import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient
//import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest
//import java.nio.file.Files
//import java.nio.file.Path
//import java.nio.file.StandardOpenOption
//import java.util.*
//
//@Configuration
//@Profile("prod", "dev", "test")
//@ComponentScan(basePackages = ["com.uag.zer0.config"])
//class SslConfig(
//    private val secretsManagerClient: SecretsManagerClient,
//) {
//    @Bean
//    fun servletContainer(): ServletWebServerFactory {
//        val factory = TomcatServletWebServerFactory()
//        factory.ssl = getSsl()
//        return factory
//    }
//
//    private fun getSsl(): Ssl {
//        val ssl = Ssl()
//        val keystorePath = getSslCertKeystore()
//        ssl.keyStore = keystorePath.toAbsolutePath().toString()
//        ssl.keyStorePassword = getSslCertKeystorePassword()
//        ssl.keyStoreType = "PKCS12"
//        ssl.keyAlias = "tomcat"
//        return ssl
//    }
//
//    private fun getSslCertKeystore(): Path {
//        val getSecretValueRequest = GetSecretValueRequest.builder()
//            .secretId("uag/ssl-certificate-keystore")
//            .build()
//        val getSecretValueResponse =
//            secretsManagerClient.getSecretValue(getSecretValueRequest)
//        val secretString = getSecretValueResponse.secretString()
//
//        val json = JSONObject(secretString)
//        val base64KeystoreData = json.getString("ssl-certificate-keystore")
//
//        val keystoreFile = Path.of("keystore.p12")
//        val decodedBytes = Base64.getDecoder().decode(base64KeystoreData)
//        Files.write(
//            keystoreFile,
//            decodedBytes,
//            StandardOpenOption.CREATE,
//            StandardOpenOption.TRUNCATE_EXISTING
//        )
//
//        return keystoreFile
//    }
//
//    private fun getSslCertKeystorePassword(): String {
//        val getSecretValueRequest = GetSecretValueRequest.builder()
//            .secretId("uag/ssl-certificate-keystore-password")
//            .build()
//        val getSecretValueResponse =
//            secretsManagerClient.getSecretValue(getSecretValueRequest)
//        val secretString = getSecretValueResponse.secretString()
//        val jsonObject = JSONObject(secretString)
//        return jsonObject.getString("ssl-certificate-keystore-password")
//    }
//}