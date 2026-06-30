package users

import (
	"github.com/claytonCharles/nexus-fight/internal/database"
	"github.com/claytonCharles/nexus-fight/internal/modules/users/dtos"
	"github.com/claytonCharles/nexus-fight/pkg/nexus"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
)

type UserHandler struct {
	service *UserService
}

func NewHandler(db *database.DB, log *logger.Logger) *UserHandler {
	repository := NewRepository(db)
	return &UserHandler{
		service: NewService(repository, log),
	}
}

func (uh *UserHandler) Show(hc *nexus.HttpContext) {

}

func (uh *UserHandler) Create(hc *nexus.HttpContext) {
	var userDto dtos.UserRegisterDTO
	if err := hc.ValidateJson(userDto); err != nil {
		hc.ResponseJson(err, 400)
		return
	}

	err := uh.service.CreateUser(userDto, false)
	if err != nil {
		hc.ResponseJson(err, 400)
	}

	hc.ResponseJson("New user create with successfully!", 201)
}

func (uh *UserHandler) Update(hc *nexus.HttpContext) {

}

func (uh *UserHandler) Delete(hc *nexus.HttpContext) {

}

func (uh *UserHandler) CreateFirstUser(hc *nexus.HttpContext) {
	var userDto dtos.UserRegisterDTO
	if err := hc.ValidateJson(&userDto); len(err) >= 1 {
		hc.ResponseJson(err, 400)
		return
	}

	err := uh.service.CreateUser(userDto, true)
	if err != nil {
		hc.ResponseJson(err.Error(), 400)
		return
	}

	hc.ResponseJson("New user create with successfully!", 201)
}
