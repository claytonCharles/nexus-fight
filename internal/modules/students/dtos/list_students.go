package dtos

import "github.com/claytonCharles/nexus-fight/internal/modules/students/models"

type ListStudents struct {
	Students []models.Student `json:"list_student"`
	Page     int              `json:"page"`
	PerPage  int              `json:"per_page"`
	Total    int              `json:"total"`
}
