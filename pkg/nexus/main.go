package nexus

import (
	"net/http"

	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
)

type Nexus struct {
	router *Router
	Logger *logger.Logger
}

func NewApp() *Nexus {
	return &Nexus{
		router: NewRouter(),
		Logger: nil,
	}
}

func (nx *Nexus) SetupLogger(pathDir string) error {
	logger, err := logger.NewLogger(pathDir)
	if err != nil {
		return err
	}

	nx.Logger = logger
	return nil
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

func (nx *Nexus) PUT(path string, handler HandlerFunc, middlewares ...Middleware) {
	nx.router.Resolve(path, http.MethodPut, handler, middlewares...)
}

func (nx *Nexus) DELETE(path string, handler HandlerFunc, middlewares ...Middleware) {
	nx.router.Resolve(path, http.MethodDelete, handler, middlewares...)
}

func (nx *Nexus) Handler(path string, handler http.Handler) {
	nx.router.Handler(path, handler)
}

func (nx *Nexus) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	nx.router.ServeHTTP(writer, request)
}
