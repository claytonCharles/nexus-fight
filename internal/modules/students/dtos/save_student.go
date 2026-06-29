package dtos

import (
	"strings"
	"time"
)

type SaveStudentDTO struct {
	Name         string     `json:"name" rules:"required|min=3"`
	Email        *string    `json:"email" rules:"nullable|email"`
	Phone        *string    `json:"phone" rules:"nullable"`
	CPF          *string    `json:"cpf" rules:"nullable|len=11"`
	Gender       string     `json:"gender" rules:"required|max=1"`
	Headquarters string     `json:"headquarters" rules:"required"`
	Birthday     *time.Time `json:"birthday" rules:"required"`
}

func (s *SaveStudentDTO) Normalize() {
	s.Email = emptyToNil(s.Email)
	s.Phone = emptyToNil(s.Phone)
	s.CPF = emptyToNil(s.CPF)
}

func emptyToNil(s *string) *string {
	if s == nil {
		return nil
	}

	v := strings.TrimSpace(*s)
	if v == "" {
		return nil
	}

	*s = v
	return s
}
