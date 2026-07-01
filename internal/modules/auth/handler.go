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

func NewHandler(db *database.DB, log *logger.Logger) *AuthHandler {
	repository := users.NewRepository(db)
	return &AuthHandler{
		service: NewService(repository, log),
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
		hc.ResponseJson(err.Error(), 400)
		return
	}

	sessionToken, csrfToken := uh.service.GetSessionsTokens()
	http.SetCookie(hc.Writer, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Expires:  time.Now().Add(time.Hour * 2),
		HttpOnly: true,
	})

	http.SetCookie(hc.Writer, &http.Cookie{
		Name:     "csrf_token",
		Value:    csrfToken,
		Expires:  time.Now().Add(time.Hour * 2),
		HttpOnly: false,
	})

	hc.ResponseJson(user, 200)
}
