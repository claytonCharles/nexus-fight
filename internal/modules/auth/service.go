package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"time"

	"github.com/claytonCharles/nexus-fight/internal/modules/auth/dtos"
	"github.com/claytonCharles/nexus-fight/internal/modules/users"
	"github.com/claytonCharles/nexus-fight/internal/modules/users/models"
	"github.com/claytonCharles/nexus-fight/pkg/nexus"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepository *users.UserRepository
	logger         *logger.Logger
	cache          *nexus.CacheMemory
}

var (
	ErrInvalidCredentials = errors.New("Invalid Credentials!")
	ErrUserExists         = errors.New("Users already exists!")
)

func NewService(userRepo *users.UserRepository, log *logger.Logger, cache *nexus.CacheMemory) *AuthService {
	return &AuthService{
		userRepository: userRepo,
		logger:         log,
		cache:          cache,
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

func (as *AuthService) GenerateSession(user *models.User) (*dtos.Session, error) {
	if user == nil {
		return nil, ErrInvalidCredentials
	}

	sessionToken := as.generateToken(32)
	csrfToken := as.generateToken(32)
	expiration := time.Hour * 2
	data := map[string]any{
		"csrf_token": csrfToken,
		"user": dtos.UserSession{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			Active:    user.Active,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		},
	}

	as.cache.Set(sessionToken, data, expiration)
	return &dtos.Session{
		SessionToken: sessionToken,
		CSRFToken:    csrfToken,
		Duration:     expiration,
	}, nil
}

func (as *AuthService) InvalidateSession(sessionID string) {
	as.cache.Delete(sessionID)
}

func (as *AuthService) CheckExistUsers() (bool, error) {
	exists, err := as.userRepository.ExistsUsers()
	if err != nil {
		as.logger.Error(ErrUserExists.Error(), err)
		return false, ErrUserExists
	}

	return !exists, nil
}

func (as *AuthService) generateToken(length int) string {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		as.logger.Error("Fatal error on generate token!", err)
		panic("Fatal error on generate token!")
	}

	return base64.URLEncoding.EncodeToString(bytes)
}
