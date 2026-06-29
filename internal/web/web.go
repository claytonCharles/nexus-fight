package web

import (
	"embed"
	"io/fs"
	"net/http"
	"strings"
)

//go:embed frontend/dist/*
var FrontendFS embed.FS

func SpaHandler() http.Handler {
	distFS, err := fs.Sub(FrontendFS, "frontend/dist")
	if err != nil {
		panic(err)
	}

	fileServer := http.FileServer(http.FS(distFS))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		_, err := fs.Stat(distFS, strings.TrimPrefix(path, "/"))
		if err == nil {
			fileServer.ServeHTTP(w, r)
			return
		}

		http.ServeFileFS(w, r, distFS, "index.html")
	})
}
