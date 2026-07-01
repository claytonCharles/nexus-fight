package users

import (
	"errors"

	"github.com/claytonCharles/nexus-fight/internal/modules/users/dtos"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repository *UserRepository
	logger     *logger.Logger
}

var (
	ErrCreateUser             = errors.New("Error on create a new user!")
	ErrPasswordInvalid        = errors.New("Password is invalid!")
	ErrFirstUserAlreadyExists = errors.New("First user of the system already created")
)

func NewService(repo *UserRepository, log *logger.Logger) *UserService {
	return &UserService{
		repository: repo,
		logger:     log,
	}
}

func (us *UserService) CreateUser(userDto dtos.UserRegisterDTO, first bool) error {
	if first {
		exists, err := us.repository.ExistsUsers()
		if err != nil {
			us.logger.Error(ErrCreateUser.Error(), err)
			return ErrCreateUser
		}

		if exists {
			us.logger.Error(ErrFirstUserAlreadyExists.Error(), err)
			return ErrFirstUserAlreadyExists
		}
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(userDto.Password), 12)
	if err != nil {
		us.logger.Error(ErrPasswordInvalid.Error(), err)
		return ErrPasswordInvalid
	}

	err = us.repository.CreateUser(userDto.Name, userDto.Email, string(passwordHash))
	if err != nil {
		us.logger.Error(ErrCreateUser.Error(), err)
		return ErrCreateUser
	}

	return nil
}
