package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/claytonCharles/nexus-fight/internal/database"
	"github.com/claytonCharles/nexus-fight/pkg/nexus"
	middlewares "github.com/claytonCharles/nexus-fight/pkg/nexus/middleware"
)

func main() {
	app := nexus.NewApp()
	app.UseMiddleware(middlewares.Recovering())
	app.UseMiddleware(middlewares.Logging())

	db, err := database.InitializeDatabase()
	if err != nil {
		log.Println("Error on connect to database!", err)
		panic("Error on connect to database!")
	}
	defer db.Conn.Close()

	app.GET("/", func(hc *nexus.HttpContext) {
		hc.ResponseJson("Hello World!", 200)
	})

	app.GET("/panic", func(hc *nexus.HttpContext) {
		panic("Recover test")
	})

	fmt.Printf("Server on http://0.0.0.0:8001\n")
	err = http.ListenAndServe(":8001", app)
	if err != nil {
		fmt.Println("Error on start server", err)
	}
}
