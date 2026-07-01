package auth

import (
	"net/http"
	"time"

	"github.com/claytonCharles/nexus-fight/internal/database"
	"github.com/claytonCharles/nexus-fight/internal/modules/auth/dtos"
	"github.com/claytonCharles/nexus-fight/internal/modules/users"
	"github.com/claytonCharles/nexus-fight/pkg/nexus"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
)

type AuthHandler struct {
	service *AuthService
}

func NewHandler(db *database.DB, log *logger.Logger, cache *nexus.CacheMemory) *AuthHandler {
	repository := users.NewRepository(db)
	return &AuthHandler{
		service: NewService(repository, log, cache),
	}
}

func (uh *AuthHandler) Login(hc *nexus.HttpContext) {
	var loginDto dtos.LoginRequestDTO
	if err := hc.ValidateJson(&loginDto); len(err) >= 1 {
		hc.ResponseJson(err, 400)
		return
	}

	user, err := uh.service.CheckCredentials(loginDto)
	if err != nil {
		hc.ResponseJson(err.Error(), 403)
		return
	}

	session, err := uh.service.GenerateSession(user)
	if err != nil {
		hc.ResponseJson(err.Error(), 403)
		return
	}

	http.SetCookie(hc.Writer, &http.Cookie{
		Name:     "session_token",
		Value:    session.SessionToken,
		Expires:  time.Now().Add(session.Duration),
		HttpOnly: true,
	})

	http.SetCookie(hc.Writer, &http.Cookie{
		Name:     "csrf_token",
		Value:    session.CSRFToken,
		Expires:  time.Now().Add(session.Duration),
		HttpOnly: false,
	})

	hc.ResponseJson("Authenticated successfully!", 204)
}

func (uh *AuthHandler) Logout(hc *nexus.HttpContext) {
	session, _ := hc.Request.Cookie("session_token")

	uh.service.InvalidateSession(session.Value)

	http.SetCookie(hc.Writer, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: true,
	})

	http.SetCookie(hc.Writer, &http.Cookie{
		Name:     "csrf_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: false,
	})

	hc.ResponseJson("Logout successfully!", 204)
}

func (uh *AuthHandler) GetAuthUser(hc *nexus.HttpContext) {
	user, ok := hc.SessionGet("user")
	if !ok {
		hc.ResponseJson(ErrInvalidCredentials.Error(), 403)
		return
	}

	hc.ResponseJson(user, 200)
}

func (uh *AuthHandler) CanRegister(hc *nexus.HttpContext) {
	can, err := uh.service.CheckExistUsers()
	if err != nil {
		hc.ResponseJson(err.Error(), 403)
		return
	}

	hc.ResponseJson(map[string]any{"can_register": can}, 200)
}
