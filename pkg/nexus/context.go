package nexus

import (
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"
	"regexp"
	"strconv"
	"strings"
)

type HttpContext struct {
	Writer  http.ResponseWriter
	Request *http.Request
}

type ValidateError map[string][]string

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

func (hc *HttpContext) InternalError() {
	http.Error(hc.Writer, "Erro Interno", http.StatusInternalServerError)
}

func (hc *HttpContext) ValidateJson(data any) ValidateError {
	errors := make(ValidateError)

	if err := json.NewDecoder(hc.Request.Body).Decode(&data); err != nil {
		errors["body"] = []string{"JSON Format invalid!"}
		return errors
	}

	values := reflect.ValueOf(data).Elem()
	schema := values.Type()

	for i := 0; i < values.NumField(); i++ {
		fValue := values.Field(i)
		fType := schema.Field(i)

		if !fValue.CanInterface() {
			continue
		}

		key, _, _ := strings.Cut(fType.Tag.Get("json"), ",")
		rules := fType.Tag.Get("rules")

		value := hc.valueToString(fValue)
		hc.validRules(key, value, rules, errors)
	}

	return errors
}

func (hc *HttpContext) validRules(key string, value string, rules string, errors ValidateError) {
	fmt.Println(key)
	if rules == "" {
		return
	}

	for rule := range strings.SplitSeq(rules, "|") {
		switch {
		case rule == "required":
			if strings.TrimSpace(value) == "" {
				errors[key] = append(errors[key], "Field is required.")
			}
		case rule == "email":
			valid, _ := regexp.MatchString(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, value)
			if !valid {
				errors[key] = append(errors[key], "Invalid email.")
			}
		case strings.HasPrefix(rule, "min="):
			min, _ := strconv.Atoi(strings.TrimPrefix(rule, "min="))
			if len(value) < min {
				errors[key] = append(errors[key], fmt.Sprintf("Field needed a min %d characters.", min))
			}
		}
	}
}

func (hc *HttpContext) valueToString(v reflect.Value) string {
	if v.Kind() == reflect.Pointer {
		if v.IsNil() {
			return ""
		}

		v = v.Elem()
	}

	if v.Kind() == reflect.String {
		return v.String()
	}

	return fmt.Sprintf("%v", v.Interface())
}
