package dtos

type LoginRequestDTO struct {
	Email    string `json:"email" rules:"required|email"`
	Password string `json:"password" rules:"required|min=8"`
}
