package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/claytonCharles/nexus-fight/internal/database"
	"github.com/claytonCharles/nexus-fight/internal/modules/bioimpedances"
	"github.com/claytonCharles/nexus-fight/internal/modules/students"
	"github.com/claytonCharles/nexus-fight/internal/modules/users"
	"github.com/claytonCharles/nexus-fight/internal/web"
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

	uh := users.NewHandler(db, app.Logger)
	app.POST("/api/user/setup", uh.CreateFirstUser)

	hs := students.NewHandler(db, app.Logger)
	app.GET("/api/student/list", hs.ListStudents)
	app.GET("/api/student/show", hs.ShowStudent)
	app.POST("/api/student/create", hs.CreateStudent)
	app.POST("/api/student/update", hs.UpdateStudent)
	app.DELETE("/api/student/delete", hs.DeactivateStudent)

	hb := bioimpedances.NewHandler(db, app.Logger)
	app.GET("/api/bioimpedance/list", hb.ListBios)
	app.POST("/api/bioimpedance/create", hb.CreateBio)

	app.Handler("/", web.SpaHandler())

	fmt.Printf("Server on http://0.0.0.0:8001\n")
	err = http.ListenAndServe(":8001", app)
	if err != nil {
		fmt.Println("Error on start server", err)
	}
}
