plugins {
    war
    id("org.springframework.boot") version "3.3.1"
    id("io.spring.dependency-management") version "1.1.5"
    id("org.openapi.generator") version "7.4.0"
    kotlin("jvm") version "1.9.24"
    kotlin("plugin.spring") version "1.9.24"
    kotlin("kapt") version "2.0.20"
}

group = "com.ila"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // SpringFramework
    implementation("org.springframework.boot:spring-boot-starter-web")
    providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")

    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // AWS
    implementation("io.awspring.cloud:spring-cloud-aws-starter:3.3.0")
    implementation("io.awspring.cloud:spring-cloud-aws-starter-sqs:3.3.0")
    implementation("com.amazonaws:aws-java-sdk-dynamodb:1.12.757")
    implementation("io.github.boostchicken:spring-data-dynamodb:5.2.5")
    implementation(platform("software.amazon.awssdk:bom:2.26.18"))
    implementation("software.amazon.awssdk:dynamodb-enhanced")
    implementation("software.amazon.awssdk:cognitoidentityprovider:2.20.126")
    implementation("software.amazon.awssdk:s3:2.32.24")
    implementation("software.amazon.awssdk:sqs:2.32.15")
    implementation("software.amazon.awssdk:sso:2.31.35")
    implementation("software.amazon.awssdk:ssooidc:2.31.35")
    implementation("software.amazon.awssdk:bedrockruntime:2.32.3")

    // Firebase
    implementation("com.google.firebase:firebase-admin:9.2.0")

    // UUID
    implementation("com.aventrix.jnanoid:jnanoid:2.0.0")

    // JWT,JSON
    implementation("com.auth0:java-jwt:4.2.1")
    implementation("org.json:json:20240303")

    // Jackson
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.17.2")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.17.2")

    // MapStruct
    implementation("org.mapstruct:mapstruct:1.6.0")
    kapt("org.mapstruct:mapstruct-processor:1.6.0")

    // Stripe
    implementation("com.stripe:stripe-java:29.5.0")

    // Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // OpenAPI Generatorで生成されたコード用
    implementation("com.google.code.findbugs:jsr305:3.0.2")
    implementation("org.openapitools:jackson-databind-nullable:0.2.6")
    implementation("javax.validation:validation-api:2.0.1.Final")
    implementation("javax.annotation:javax.annotation-api:1.3.2")
    implementation("javax.servlet:javax.servlet-api:4.0.1")
    implementation("io.swagger.core.v3:swagger-core:2.2.21")
    implementation("io.swagger.core.v3:swagger-models:2.2.21")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// OpenAPI Generatorのタスク設定
openApiGenerate {
    generatorName.set("kotlin-spring")
    inputSpec.set("$rootDir/../docs/openapi/v1/ila-v1.yaml")
    outputDir.set("$rootDir")
    apiPackage.set("com.ila.zer0.generated.endpoint")
    modelPackage.set("com.ila.zer0.generated.model")
    configOptions.set(
        mapOf(
            "interfaceOnly" to "true",
            "useSpringBoot3" to "true",
            "useTags" to "true",
            "gradleBuildFile" to "false",
            "modelMutable" to "true",
        )
    )
    typeMappings.set(mapOf("file" to "org.springframework.web.multipart.MultipartFile"))
}

// OpenAPI Generatorの追加設定
tasks.named("openApiGenerate") {
    doNotTrackState("OpenAPI生成は常に実行する必要があるため")
    // 生成前にclean
    doFirst {
        delete("$rootDir/src/main/kotlin/com/ila/zer0/generated")
    }
    // 生成後に不要ファイル削除
    doLast {
        delete(
            "$rootDir/README.md",
            "$rootDir/pom.xml",
            "$rootDir/.openapi-generator",
            "$rootDir/.openapi-generator-ignore",
            "$rootDir/src/main/kotlin/org/openapitools/SpringDocConfiguration.kt"
        )
    }
}

// clean時にOpenAPI生成物をclean
tasks.named("clean") {
    doLast {
        delete("$rootDir/src/main/kotlin/com/ila/zer0/generated")
    }
}

// ビルド時、OpenAPIを生成する設定
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    dependsOn("openApiGenerate")
}
tasks.named("processResources") {
    dependsOn(":openApiGenerate")
}

// プロファイルの設定
tasks.named<org.springframework.boot.gradle.tasks.run.BootRun>("bootRun") {
    systemProperty("spring.profiles.active", "prod")
}
tasks.register<org.springframework.boot.gradle.tasks.run.BootRun>("bootRunDev") {
    doFirst {
        exec {
            workingDir = file("nginx")
            commandLine("sh", "launch.sh")
        }

        exec {
            workingDir = file("db")
            commandLine("sh", "launch.sh")
        }

        systemProperty("spring.profiles.active", "dev")
    }
    mainClass.set("com.ila.zer0.Application")
    classpath = sourceSets["main"].runtimeClasspath
}

tasks.withType<org.springframework.boot.gradle.tasks.bundling.BootWar> {
    archiveFileName.set("ila-backend.war")
}