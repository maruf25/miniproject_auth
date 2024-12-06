package routes

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/maruf25/miniproject_auth/backend/config"
	"github.com/maruf25/miniproject_auth/backend/pkg/db"
)

type Product struct {
	Name        string  `json:"name,omitempty" binding:"required"`
	Description string  `json:"description,omitempty" binding:"required"`
	Stock       int64   `json:"stock,omitempty" binding:"required,gt=0"`
	Price       float64 `json:"price,omitempty" binding:"required,gt=0"`
}

func createProduct(context *gin.Context) {
	ctx := config.CtxBackground
	var product Product
	err := context.ShouldBindJSON(&product)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Could not parse request data.",
			"data":    err.Error(),
		})
		return
	}

	insertProduct, err := config.Queries.CreateProduct(*ctx, db.CreateProductParams{
		Name:        product.Name,
		Description: product.Description,
		Stock:       int32(product.Stock),
		Price:       product.Price,
	})
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not create product.",
		})
		return
	}

	context.JSON(http.StatusCreated, gin.H{
		"product": insertProduct,
	})
}

func getProducts(context *gin.Context) {
	ctx := config.CtxBackground
	products, err := config.Queries.GetProducts(*ctx)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not get products.",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"products": products,
	})
}

func getProduct(context *gin.Context) {
	ctx := config.CtxBackground
	productId := context.Param("id")
	id, err := strconv.ParseInt(productId, 10, 32)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not parse id",
		})
		return
	}

	product, err := config.Queries.GetProduct(*ctx, id)
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{
			"message": "Could not get product.",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"product": product,
	})
}
