package nexus

import (
	"encoding/json"
	"net/http"
)

type HttpContext struct {
	Writer  http.ResponseWriter
	Request *http.Request
}

func NewContext(writer http.ResponseWriter, req *http.Request) *HttpContext {
	return &HttpContext{
		Writer:  writer,
		Request: req,
	}
}

func (hc *HttpContext) ResponseJson(data any, status int) {
	hc.Writer.Header().Set("Content-Type", "application/json")
	hc.Writer.WriteHeader(status)
	if err := json.NewEncoder(hc.Writer).Encode(data); err != nil {
		http.Error(hc.Writer, "Erro Interno", http.StatusInternalServerError)
	}
}
