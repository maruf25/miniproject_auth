package routes

import (
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/maruf25/miniproject_auth/backend/config"
	"github.com/maruf25/miniproject_auth/backend/pkg/db"
	"github.com/maruf25/miniproject_auth/backend/utils"
)

type User struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

func validateUsername(username string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9]+$`)
	return re.MatchString(username)
}

func signup(context *gin.Context) {
	ctx := config.CtxBackground
	var user User
	err := context.ShouldBindJSON(&user)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Could not parse request data.",
			"data":    err.Error(),
		})
		return
	}

	if strings.Contains(user.Username, " ") || !validateUsername(user.Username) {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Username can't contain space and simbol",
		})
		return
	}

	// Cek User apakah sudah ada
	_, err = config.Queries.GetUser(*ctx, user.Username)
	if err == nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "User already register",
		})
		return
	}

	hashPassowrd, err := utils.HashPassword(user.Password)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Could not parse request data.",
			"data":    err,
		})
		return
	}

	_, err = config.Queries.CreateUser(*ctx, db.CreateUserParams{Username: user.Username, Password: hashPassowrd})
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not create user",
		})
		return
	}

	context.JSON(http.StatusCreated, gin.H{
		"message": "user created successfully",
	})

}

func login(context *gin.Context) {
	ctx := config.CtxBackground
	var user User
	err := context.ShouldBindJSON(&user)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Could not parse request data.",
			"data":    err.Error(),
		})
		return
	}

	if strings.Contains(user.Username, " ") || !validateUsername(user.Username) {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Username can't contain space and simbol",
		})
		return
	}

	// Melakukan check User apakah ada dan sesuai
	existUser, err := config.Queries.GetUser(*ctx, user.Username)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invalid username or password",
		})
		return
	}

	isValid := utils.CheckPassword(user.Password, existUser.Password)
	if !isValid {
		context.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invalid username or password",
		})
		return
	}

	token, err := utils.GenerateToken(user.Username, existUser.ID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
	}

	context.SetCookie("token", token, 3600*2, "/", "localhost", false, false)

	context.JSON(http.StatusOK, gin.H{
		"message": "Login succesfull",
	})
}

func profile(context *gin.Context) {
	ctx := config.CtxBackground
	username := context.Param("username")

	user, err := config.Queries.GetUser(*ctx, username)
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{
			"message": "User not found",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
		},
	})
}
