package nexus

import (
	"net/http"
)

type Nexus struct {
	router *Router
}

func NewApp() *Nexus {
	return &Nexus{
		router: NewRouter(),
	}
}

func (nx *Nexus) UseMiddleware(mid Middleware) {
	nx.router.AddMiddleware(mid)
}

func (nx *Nexus) GET(path string, handler HandlerFunc, middlewares ...Middleware) {
	nx.router.Resolve(path, http.MethodGet, handler, middlewares...)
}

func (nx *Nexus) POST(path string, handler HandlerFunc, middlewares ...Middleware) {
	nx.router.Resolve(path, http.MethodPost, handler, middlewares...)
}

func (nx *Nexus) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	nx.router.ServeHTTP(writer, request)
}
