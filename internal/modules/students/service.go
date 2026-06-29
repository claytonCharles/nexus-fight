package students

import (
	"errors"

	"github.com/claytonCharles/nexus-fight/internal/modules/students/dtos"
	"github.com/claytonCharles/nexus-fight/internal/modules/students/models"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
)

type StudentService struct {
	repository *StudentRepository
	logger     *logger.Logger
}

var (
	ErrDuplicatedData = errors.New("Some information (email, phone, or CPF) is duplicated.")
	ErrCreateStudent  = errors.New("Error on create a new student!")
)

func NewService(repo *StudentRepository, log *logger.Logger) *StudentService {
	return &StudentService{
		repository: repo,
		logger:     log,
	}
}

func (ss *StudentService) ListStudents() ([]models.Student, error) {
	students, err := ss.repository.ListStudents()
	if err != nil {
		ss.logger.Error("Fail on list students", err)
		return nil, err
	}

	return students, nil
}

func (ss *StudentService) CreateStudent(student dtos.SaveStudentDTO) error {
	student.Normalize()
	err := ss.repository.ValidateStudentData(student.Email, student.Phone, student.CPF)
	if err == ErrEmailAlreadyExists || err == ErrPhoneAlreadyExists || err == ErrCPFAlreadyExists {
		return err
	}

	if err != nil {
		ss.logger.Error(ErrCreateStudent.Error(), err)
		return ErrCreateStudent
	}

	err = ss.repository.CreateStudent(
		student.Name,
		student.Email,
		student.Phone,
		student.CPF,
		student.Gender,
		student.Headquarters,
		student.Birthday,
	)

	if err != nil {
		ss.logger.Error(ErrCreateStudent.Error(), err)
		return ErrCreateStudent
	}

	return nil
}
