package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/maruf25/miniproject_auth/backend/middlewares"
)

func RegisterRoutes(server *gin.Engine) {
	server.POST("/signup", signup)
	server.POST("/login", login)
	server.GET("/profile/:username", middlewares.Authenticate, profile)
	server.GET("/checklogin", middlewares.Authenticate, checkLogin)

	server.POST("/products", middlewares.Authenticate, createProduct)
	server.GET("/products", middlewares.Authenticate, getProducts)
	server.GET("/products/:id", middlewares.Authenticate, getProduct)
}
