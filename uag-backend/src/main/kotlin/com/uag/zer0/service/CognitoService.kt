package com.uag.zer0.service

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserNotFoundException

@Service
class CognitoService(
    private val cognitoClient: CognitoIdentityProviderClient,
    @Value("\${cognito.pool-id}")
    private val cognitoPoolId: String,
    @Value("\${security.paths.no-bearer-token}")
    private val noBearerTokenPathAndMethodString: String
) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    /**
     * userIdに紐づくemailを取得し、同じemailの全ユーザーを削除
     * @param userId 削除対象のユーザーID（Cognitoのusername）
     * @return 削除したユーザー数（0の場合は該当ユーザーなし）
     */
    fun deleteAllUsersByUserIdSilently(userId: String): Int {
        return try {
            // 1. userIdからemailを取得
            val userResponse = cognitoClient.adminGetUser { req ->
                req.userPoolId(cognitoPoolId)
                    .username(userId)
            }

            val emailAttribute = userResponse.userAttributes()
                .firstOrNull { it.name() == "email" }
                ?: run {
                    logger.warn("User $userId has no email attribute")
                    return 0
                }

            val email = emailAttribute.value()

            // 2. 取得したemailで全ユーザー検索
            val users = cognitoClient.listUsers { req ->
                req.userPoolId(cognitoPoolId)
                    .filter("email = \"$email\"")
            }.users()

            if (users.isEmpty()) {
                logger.info("No users found with email: $email (No action taken)")
                return 0
            }

            // 3. 全ユーザー削除
            users.forEach { user ->
                cognitoClient.adminDeleteUser { req ->
                    req.userPoolId(cognitoPoolId)
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