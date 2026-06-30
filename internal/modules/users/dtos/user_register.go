package dtos

type UserRegisterDTO struct {
	Name     string `json:"name" rules:"required|min=3"`
	Email    string `json:"email" rules:"required|email"`
	Password string `json:"password" rules:"required|min=8"`
}
