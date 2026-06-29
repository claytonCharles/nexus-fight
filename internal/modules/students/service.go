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
	ErrRetriveData     = errors.New("Failed to retrieve student information.")
	ErrCreateStudent   = errors.New("Error on create a new student!")
	ErrStudentNotFound = errors.New("Student is not found!")
	ErrUpdateStudent   = errors.New("Updated student information unsuccessfully!")
	ErrDeleteStudent   = errors.New("Delete student unsuccessfully!")
)

func NewService(repo *StudentRepository, log *logger.Logger) *StudentService {
	return &StudentService{
		repository: repo,
		logger:     log,
	}
}

func (ss *StudentService) ListStudents(page int) (*dtos.ListStudents, error) {
	perPage := 10
	students, total, err := ss.repository.ListStudents(page, perPage)
	if err != nil {
		ss.logger.Error("Fail on list students", err)
		return nil, err
	}

	return &dtos.ListStudents{
		Students: students,
		Page:     page,
		PerPage:  perPage,
		Total:    total,
	}, nil
}

func (ss *StudentService) GetStudent(id string) (*models.Student, error) {
	student, err := ss.repository.GetStudentByID(id)
	if err != nil {
		ss.logger.Error(ErrRetriveData.Error(), err)
		return nil, ErrRetriveData
	}

	if student == nil {
		ss.logger.Error(ErrStudentNotFound.Error(), err)
		return nil, ErrStudentNotFound
	}

	return student, nil
}

func (ss *StudentService) CreateStudent(studentDto dtos.SaveStudentDTO) error {
	err := ss.repository.ValidateStudentData(studentDto.Email, studentDto.Phone, studentDto.CPF, nil)
	if err == ErrEmailAlreadyExists || err == ErrPhoneAlreadyExists || err == ErrCPFAlreadyExists {
		return err
	}

	if err != nil {
		ss.logger.Error(ErrCreateStudent.Error(), err)
		return ErrCreateStudent
	}

	err = ss.repository.CreateStudent(
		studentDto.Name,
		studentDto.Email,
		studentDto.Phone,
		studentDto.CPF,
		studentDto.Gender,
		studentDto.Headquarters,
		studentDto.Birthday,
	)

	if err != nil {
		ss.logger.Error(ErrCreateStudent.Error(), err)
		return ErrCreateStudent
	}

	return nil
}

func (ss *StudentService) UpdateStudent(studentDto dtos.SaveStudentDTO, id string) error {
	student, err := ss.repository.GetStudentByID(id)
	if student == nil || err != nil {
		ss.logger.Error(ErrStudentNotFound.Error(), err)
		return ErrStudentNotFound
	}

	err = ss.repository.ValidateStudentData(studentDto.Email, studentDto.Phone, studentDto.CPF, &id)
	if err == ErrEmailAlreadyExists || err == ErrPhoneAlreadyExists || err == ErrCPFAlreadyExists {
		return err
	}

	err = ss.repository.UpdateStudent(
		id,
		studentDto.Name,
		studentDto.Email,
		studentDto.Phone,
		studentDto.CPF,
		studentDto.Gender,
		studentDto.Headquarters,
		studentDto.Birthday,
	)

	if err != nil {
		ss.logger.Error(ErrUpdateStudent.Error(), err)
		return ErrUpdateStudent
	}

	return nil
}

func (ss *StudentService) DeactivateStudent(id string) error {
	student, err := ss.repository.GetStudentByID(id)
	if student == nil || err != nil {
		ss.logger.Error(ErrStudentNotFound.Error(), err)
		return ErrStudentNotFound
	}

	err = ss.repository.DeactivateStudent(id)
	if err != nil {
		ss.logger.Error(ErrDeleteStudent.Error(), err)
		return ErrDeleteStudent
	}

	return nil
}
