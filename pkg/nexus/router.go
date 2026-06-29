package nexus

import (
	"net/http"
)

type HandlerFunc func(*HttpContext)

type Middleware func(HandlerFunc) HandlerFunc

type Router struct {
	mux         *http.ServeMux
	routes      map[string]http.HandlerFunc
	middlewares []Middleware
}

func NewRouter() *Router {
	return &Router{
		mux:         http.NewServeMux(),
		routes:      make(map[string]http.HandlerFunc),
		middlewares: []Middleware{},
	}
}

func (r *Router) AddMiddleware(mid Middleware) {
	r.middlewares = append(r.middlewares, mid)
}

func (r *Router) Resolve(path string, method string, handler HandlerFunc, middlewares ...Middleware) {
	r.mux.HandleFunc(path, func(w http.ResponseWriter, req *http.Request) {
		if req.Method != method {
			http.NotFound(w, req)
			return
		}

		c := NewContext(w, req)
		hf := r.chain(handler, middlewares...)
		hf(c)
	})
}

func (r *Router) Handler(path string, h http.Handler) {
	r.mux.Handle(path, h)
}

func (r *Router) chain(hf HandlerFunc, hm ...Middleware) HandlerFunc {
	middlewares := r.middlewares
	if len(hm) >= 1 {
		middlewares = append([]Middleware{}, r.middlewares...)
		middlewares = append(middlewares, hm...)
	}

	for i := len(middlewares) - 1; i >= 0; i-- {
		hf = middlewares[i](hf)
	}

	return hf
}

func (r *Router) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	r.mux.ServeHTTP(writer, request)
}
