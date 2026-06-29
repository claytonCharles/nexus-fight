package bioimpedances

import (
	"errors"

	"github.com/claytonCharles/nexus-fight/internal/modules/bioimpedances/dtos"
	"github.com/claytonCharles/nexus-fight/internal/modules/bioimpedances/models"
	"github.com/claytonCharles/nexus-fight/internal/modules/students"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
)

type BioimpedanceService struct {
	repository        *BioimpedanceRepository
	studentRepository *students.StudentRepository
	logger            *logger.Logger
}

var (
	ErrRetriveData     = errors.New("Failed to retrieve student bioimpedances information.")
	ErrCreateBio       = errors.New("Error on create a new bioimpedance!")
	ErrStudentNotFound = errors.New("Student is not found!")
)

func NewService(
	repo *BioimpedanceRepository,
	studentRepo *students.StudentRepository,
	log *logger.Logger,
) *BioimpedanceService {
	return &BioimpedanceService{
		repository:        repo,
		studentRepository: studentRepo,
		logger:            log,
	}
}

func (bs *BioimpedanceService) ListBioimpedances(id string) ([]models.Bioimpedance, error) {
	bios, err := bs.repository.ListBioimpedances(id)
	if err != nil {
		bs.logger.Error(ErrRetriveData.Error(), err)
		return bios, ErrRetriveData
	}

	return bios, nil
}

func (bs *BioimpedanceService) CreateBioimpedance(bioDto dtos.SaveBioimpedanceDTO) error {
	student, err := bs.studentRepository.GetStudentByID(bioDto.StudentID)
	if err != nil || student == nil {
		bs.logger.Error(ErrStudentNotFound.Error(), err)
		return ErrStudentNotFound
	}

	err = bs.repository.CreateBioimpedance(
		bioDto.StudentID,
		bioDto.TBW,
		bioDto.Height,
		bioDto.Weight,
		bioDto.BodyFatPercent,
		bioDto.VisceralFat,
		bioDto.MusclePercent,
		bioDto.Systolic,
		bioDto.Diastolic,
		bioDto.BMR,
		bioDto.LeftGripStrength,
		bioDto.RightGripStrength,
		bioDto.BodyAge,
	)

	if err != nil {
		bs.logger.Error(ErrCreateBio.Error(), err)
		return ErrCreateBio
	}

	return nil
}
