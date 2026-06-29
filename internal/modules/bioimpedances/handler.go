package bioimpedances

import (
	"strings"

	"github.com/claytonCharles/nexus-fight/internal/database"
	"github.com/claytonCharles/nexus-fight/internal/modules/bioimpedances/dtos"
	"github.com/claytonCharles/nexus-fight/internal/modules/students"
	"github.com/claytonCharles/nexus-fight/pkg/nexus"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
)

type Handler struct {
	service *BioimpedanceService
}

func NewHandler(db *database.DB, log *logger.Logger) *Handler {
	repository := NewRepository(db, log)
	studentRepo := students.NewRepository(db, log)
	return &Handler{
		service: NewService(repository, studentRepo, log),
	}
}

func (h *Handler) ListBios(hc *nexus.HttpContext) {
	id := hc.Params().Get("id")
	if strings.TrimSpace(id) == "" {
		hc.ResponseJson("ID Student is needed!", 400)
		return
	}

	bios, err := h.service.ListBioimpedances(id)
	if err != nil {
		hc.InternalError()
		return
	}

	hc.ResponseJson(bios, 200)
}

func (h *Handler) CreateBio(hc *nexus.HttpContext) {
	var bioDto dtos.SaveBioimpedanceDTO
	if err := hc.ValidateJson(&bioDto); len(err) >= 1 {
		hc.ResponseJson(err, 400)
		return
	}

	err := h.service.CreateBioimpedance(bioDto)
	if err != nil {
		hc.ResponseJson(err.Error(), 400)
		return
	}

	hc.ResponseJson("New Student Bioimpedance created successfully!", 201)
}
