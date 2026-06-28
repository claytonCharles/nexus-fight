package dtos

import "time"

type SaveStudentDTO struct {
	Name         string     `json:"name" rules:"required|min=3"`
	Email        *string    `json:"email" rules:"required|email"`
	Phone        *string    `json:"phone" rules:"required"`
	CPF          *string    `json:"cpf" rules:"required"`
	Gender       string     `json:"gender" rules:"required"`
	Headquarters string     `json:"headquarters" rules:"required"`
	Birthday     *time.Time `json:"birthday" rules:"required"`
}
