package middlewares

import (
	"log"
	"net/http"
	"time"

	"github.com/claytonCharles/nexus-fight/pkg/nexus"
)

func Recovering() nexus.Middleware {
	return func(hf nexus.HandlerFunc) nexus.HandlerFunc {
		return func(hc *nexus.HttpContext) {
			defer func() {
				if p := recover(); p != nil {
					log.Println("System Panic!", p)
					http.Error(hc.Writer, "Internal Server Error", http.StatusInternalServerError)
				}
			}()

			hf(hc)
		}
	}
}

func Logging() nexus.Middleware {
	return func(hf nexus.HandlerFunc) nexus.HandlerFunc {
		return func(hc *nexus.HttpContext) {
			start := time.Now()
			path := hc.Request.URL.Path
			method := hc.Request.Method
			defer func() {
				log.Printf("Method %s | Path \"%s\" | Time %v\n", method, path, time.Since(start))
			}()

			hf(hc)
		}
	}
}
