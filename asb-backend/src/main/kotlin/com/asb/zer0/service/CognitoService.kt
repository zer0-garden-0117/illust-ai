package com.asb.zer0.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserNotFoundException

@Service
class CognitoService(
    private val cognitoClient: CognitoIdentityProviderClient,
    private val poolId: String
) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    fun deleteAllUsersByUserIdSilently(userId: String): Int {
        return try {
            // email取得
            val userResponse = cognitoClient.adminGetUser { req ->
                req.userPoolId(poolId)
                    .username(userId)
            }
            val emailAttribute = userResponse.userAttributes()
                .firstOrNull { it.name() == "email" }
                ?: run {
                    logger.warn("User $userId has no email attribute")
                    return 0
                }
            val email = emailAttribute.value()

            // emailに紐づくユーザー取得
            val users = cognitoClient.listUsers { req ->
                req.userPoolId(poolId)
                    .filter("email = \"$email\"")
            }.users()
            if (users.isEmpty()) {
                logger.info("No users found with email: $email (No action taken)")
                return 0
            }

            // ユーザー削除
            users.forEach { user ->
                cognitoClient.adminDeleteUser { req ->
                    req.userPoolId(poolId)
                        .username(user.username())
                }
                logger.info("Deleted user: ${user.username()} (Provider: ${user.userStatus()})")
            }

            users.size

        } catch (e: UserNotFoundException) {
            logger.info("User not found with userId: $userId")
            0
        } catch (e: Exception) {
            logger.error("Error deleting users for userId: $userId", e)
            0
        }
    }
}