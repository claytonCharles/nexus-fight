package nexus

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"reflect"
	"regexp"
	"strconv"
	"strings"
)

type HttpContext struct {
	Writer  http.ResponseWriter
	Request *http.Request
	session map[string]any
}

type ValidateError map[string][]string

func NewContext(writer http.ResponseWriter, req *http.Request) *HttpContext {
	return &HttpContext{
		Writer:  writer,
		Request: req,
		session: make(map[string]any),
	}
}

func (hc *HttpContext) Params() url.Values {
	return hc.Request.URL.Query()
}

func (hc *HttpContext) SessionGet(key string) (any, bool) {
	v, ok := hc.session[key]
	return v, ok
}

func (hc *HttpContext) SessionSet(key string, value any) {
	hc.session[key] = value
}

func (hc *HttpContext) ResponseJson(data any, status int) {
	hc.Writer.Header().Set("Content-Type", "application/json")
	hc.Writer.WriteHeader(status)
	if err := json.NewEncoder(hc.Writer).Encode(data); err != nil {
		http.Error(hc.Writer, "Erro Interno", http.StatusInternalServerError)
	}
}

func (hc *HttpContext) ResponseNoContent() {
	hc.Writer.WriteHeader(http.StatusNoContent)
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
	if rules == "" {
		return
	}

	for rule := range strings.SplitSeq(rules, "|") {
		switch {
		case rule == "nullable":
			if strings.TrimSpace(value) == "" {
				delete(errors, key)
				return
			}
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
				errors[key] = append(errors[key], fmt.Sprintf("Minimum length is %d characters.", min))
			}
		case strings.HasPrefix(rule, "max="):
			max, _ := strconv.Atoi(strings.TrimPrefix(rule, "max="))
			if len(value) > max {
				errors[key] = append(errors[key], fmt.Sprintf("Maximum length is %d characters.", max))
			}
		case strings.HasPrefix(rule, "len="):
			length, _ := strconv.Atoi(strings.TrimPrefix(rule, "len="))
			if len(value) != length {
				errors[key] = append(errors[key], fmt.Sprintf("The value must be exactly %d characters long.", length))
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
