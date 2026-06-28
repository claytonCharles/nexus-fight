package models

import "time"

type Student struct {
	ID           string     `json:"id"`
	Name         string     `json:"name"`
	Email        *string    `json:"email"`
	Phone        *string    `json:"phone"`
	CPF          *string    `json:"cpf"`
	Gender       string     `json:"gender"`
	Headquarters string     `json:"headquarters"`
	Birthday     *time.Time `json:"birthday"`
	Active       int8       `json:"active"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}
