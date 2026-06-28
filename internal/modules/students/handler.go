package students

import (
	"github.com/claytonCharles/nexus-fight/internal/database"
	"github.com/claytonCharles/nexus-fight/internal/modules/students/dtos"
	"github.com/claytonCharles/nexus-fight/pkg/nexus"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
)

type Handler struct {
	service *StudentService
}

func NewHandler(db *database.DB, log *logger.Logger) *Handler {
	repository := NewRepository(db, log)
	return &Handler{
		service: NewService(repository, log),
	}
}

func (h *Handler) ListStudents(hc *nexus.HttpContext) {
	students, err := h.service.ListStudents()
	if err != nil {
		hc.InternalError()
		return
	}

	hc.ResponseJson(students, 200)
}

func (h *Handler) CreateStudent(hc *nexus.HttpContext) {
	var studentDto dtos.SaveStudentDTO
	if err := hc.ValidateJson(&studentDto); len(err) >= 1 {
		hc.ResponseJson(err, 400)
		return
	}

	err := h.service.CreateStudent(studentDto)
	if err != nil {
		hc.ResponseJson(err.Error(), 400)
		return
	}

	hc.ResponseJson("New Student created successfully!", 200)
}
