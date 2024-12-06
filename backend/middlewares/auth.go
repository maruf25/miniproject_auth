package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/maruf25/miniproject_auth/backend/utils"
)

func Authenticate(context *gin.Context) {
	// token := context.Request.Header.Get("Authorization")
	token, err := context.Cookie("token")
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"message": "Not Authorized",
		})
		return
	}

	userId, err := utils.VerifyToken(token)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"message": "Not Authorized",
		})
		return
	}

	context.Set("userId", userId)

	context.Next()
}
