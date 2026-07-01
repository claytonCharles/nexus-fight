package dtos

import "time"

type UserSession struct {
	ID        string
	Name      string
	Email     string
	Active    bool
	CreatedAt time.Time
	UpdatedAt time.Time
}
