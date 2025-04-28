package main

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

type Product struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

var products []Product

func main() {
	e := echo.New()

	e.POST("/products", addProduct)
	e.GET("/products", listProducts)

	e.Start(":8080")
}

func addProduct(c echo.Context) error {
	var p Product
	if err := c.Bind(&p); err != nil {
		return err
	}

	products = append(products, p)
	return c.JSON(http.StatusCreated, p)
}

func listProducts(c echo.Context) error {
	return c.JSON(http.StatusOK, products)
}
