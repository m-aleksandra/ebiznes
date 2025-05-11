package main

import (
	"github.com/labstack/echo/v4"
	"net/http"
	"strconv"
)

type Product struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

var (
	products   []Product
	nextProdID = 1
)

func main() {
	e := echo.New()

	e.POST("/products", addProduct)
	e.GET("/products", listProducts)
	e.GET("/products/:id", getProduct)
	e.PUT("/products/:id", updateProduct)
	e.DELETE("/products/:id", deleteProduct)

	e.Start(":8080")
}

func addProduct(c echo.Context) error {
	var p Product
	if err := c.Bind(&p); err != nil {
		return err
	}

	p.ID = nextProdID
	nextProdID++
	products = append(products, p)
	return c.JSON(http.StatusCreated, p)
}

func listProducts(c echo.Context) error {
	return c.JSON(http.StatusOK, products)
}

func getProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	for _, p := range products {
		if p.ID == id {
			return c.JSON(http.StatusOK, p)
		}
	}
	return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
}

func updateProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var updated Product
	if err := c.Bind(&updated); err != nil {
		return err
	}

	for i, p := range products {
		if p.ID == id {
			updated.ID = id
			products[i] = updated
			return c.JSON(http.StatusOK, updated)
		}
	}
	return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
}

func deleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	for i, p := range products {
		if p.ID == id {
			products = append(products[:i], products[i+1:]...)
			return c.NoContent(http.StatusNoContent)
		}
	}
	return c.JSON(http.StatusNotFound, echo.Map{"message": "Product not found"})
}
