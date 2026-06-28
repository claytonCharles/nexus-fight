package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/claytonCharles/nexus-fight/internal/database"
	"github.com/claytonCharles/nexus-fight/internal/modules/students"
	"github.com/claytonCharles/nexus-fight/pkg/nexus"
	middlewares "github.com/claytonCharles/nexus-fight/pkg/nexus/middleware"
)

func main() {
	app := nexus.NewApp()
	app.UseMiddleware(middlewares.Recovering())
	app.UseMiddleware(middlewares.Logging())
	app.SetupLogger("data/logs")

	db, err := database.InitializeDatabase()
	if err != nil {
		log.Println("Error on connect to database!", err)
		panic("Error on connect to database!")
	}
	defer db.Conn.Close()

	if err := db.AutoMigrate(); err != nil {
		app.Logger.Error("Fail on running migrations!", err)
		panic("Fail on running migrations!")
	}

	hs := students.NewHandler(db, app.Logger)

	app.GET("/student/list", hs.ListStudents)
	app.POST("/student/create", hs.CreateStudent)

	app.GET("/", func(hc *nexus.HttpContext) {
		hc.ResponseJson("Hello World!", 200)
	})

	app.GET("/panic", func(hc *nexus.HttpContext) {
		app.Logger.Error("Logger Recover test")
		panic("Recover test")
	})

	fmt.Printf("Server on http://0.0.0.0:8001\n")
	err = http.ListenAndServe(":8001", app)
	if err != nil {
		fmt.Println("Error on start server", err)
	}
}
