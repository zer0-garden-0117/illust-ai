package com.uag.zer0.controller

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.ComponentScan
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication(scanBasePackages = ["com.uag.zer0"])
@ComponentScan(basePackages = ["com.uag.zer0"])
@RestController
@RequestMapping("/api")
class HelloController {

    @GetMapping("/hello")
    fun hello(): String {
        return "Hello, World!"
    }

    companion object {
        private val logger: Logger =
            LoggerFactory.getLogger(HelloController::class.java)

        @JvmStatic
        fun main(args: Array<String>) {
            SpringApplication.run(HelloController::class.java, *args)
        }
    }
}