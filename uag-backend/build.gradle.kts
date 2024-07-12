plugins {
    war
    id("org.springframework.boot") version "3.3.1"
    id("io.spring.dependency-management") version "1.1.5"
    id("org.openapi.generator") version "7.4.0"
    kotlin("jvm") version "1.9.24"
    kotlin("plugin.spring") version "1.9.24"
}

group = "com.uag"
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

    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // AWS
    implementation("com.amazonaws:aws-java-sdk-dynamodb:1.12.757")
    implementation("io.github.boostchicken:spring-data-dynamodb:5.2.5")
    implementation(platform("software.amazon.awssdk:bom:2.26.18"))
    implementation("software.amazon.awssdk:dynamodb-enhanced")

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
    inputSpec.set("$rootDir/../docs/openapi/v1/uag-v1.yaml")
    outputDir.set("$rootDir")
    apiPackage.set("com.uag.zer0.generated.endpoint")
    modelPackage.set("com.uag.zer0.generated.model")
    configOptions.set(
        mapOf(
            "interfaceOnly" to "true",
            "useSpringBoot3" to "true",
            "useTags" to "true",
            "gradleBuildFile" to "false"
        )
    )
}

// OpenAPI Generatorの追加設定
tasks.named("openApiGenerate") {
    // 生成前にclean
    doFirst {
        delete("$rootDir/src/main/kotlin/com/uag/zer0/generated")
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
        delete("$rootDir/src/main/kotlin/com/uag/zer0/generated")
    }
}

// ビルド時、OpenAPIを生成する設定
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    dependsOn("openApiGenerate")
}
tasks.named("processResources") {
    dependsOn(":openApiGenerate")
}