package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"

	"github.com/claytonCharles/nexus-fight/internal/modules/auth/dtos"
	"github.com/claytonCharles/nexus-fight/internal/modules/users"
	"github.com/claytonCharles/nexus-fight/internal/modules/users/models"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepository *users.UserRepository
	logger         *logger.Logger
}

var (
	ErrInvalidCredentials = errors.New("Invalid Credentials!")
)

func NewService(userRepo *users.UserRepository, log *logger.Logger) *AuthService {
	return &AuthService{
		userRepository: userRepo,
		logger:         log,
	}
}

func (as *AuthService) CheckCredentials(loginDto dtos.LoginRequestDTO) (*models.User, error) {
	user, err := as.userRepository.GetUserByEmail(loginDto.Email)
	if err != nil {
		as.logger.Error(ErrInvalidCredentials.Error(), err)
		return nil, ErrInvalidCredentials
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginDto.Password))
	if err != nil {
		as.logger.Error(ErrInvalidCredentials.Error(), err)
		return nil, ErrInvalidCredentials
	}

	return user, nil
}

func (as *AuthService) GetSessionsTokens() (string, string) {
	sessionToken := as.generateToken(32)
	csrfToken := as.generateToken(32)

	return sessionToken, csrfToken
}

func (as *AuthService) generateToken(length int) string {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		as.logger.Error("Fatal error on generate token!", err)
		panic("Fatal error on generate token!")
	}

	return base64.URLEncoding.EncodeToString(bytes)
}
