package bioimpedances

import (
	"github.com/claytonCharles/nexus-fight/internal/database"
	"github.com/claytonCharles/nexus-fight/internal/modules/bioimpedances/models"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
)

type BioimpedanceRepository struct {
	db *database.DB
}

func NewRepository(db *database.DB, log *logger.Logger) *BioimpedanceRepository {
	return &BioimpedanceRepository{
		db: db,
	}
}

func (br *BioimpedanceRepository) ListBioimpedances(id string) ([]models.Bioimpedance, error) {
	emptyBios := make([]models.Bioimpedance, 0)

	query := `SELECT tbb.* FROM tb_bioimpedances tbb WHERE tbb.student_id = ?`

	rows, err := br.db.Conn.Query(query, id)
	if err != nil {
		return emptyBios, err
	}
	defer rows.Close()

	bioimpedances := make([]models.Bioimpedance, 0)
	for rows.Next() {
		var bio models.Bioimpedance
		if err := rows.Scan(
			&bio.ID,
			&bio.StudentID,
			&bio.TBW,
			&bio.Height,
			&bio.Weight,
			&bio.BodyFatPercent,
			&bio.VisceralFat,
			&bio.MusclePercent,
			&bio.Systolic,
			&bio.Diastolic,
			&bio.BMR,
			&bio.LeftGripStrength,
			&bio.RightGripStrength,
			&bio.BodyAge,
			&bio.CreatedAt,
			&bio.UpdatedAt,
		); err != nil {
			return emptyBios, err
		}

		bioimpedances = append(bioimpedances, bio)
	}

	return bioimpedances, nil
}

func (br *BioimpedanceRepository) CreateBioimpedance(
	studentID string,
	tbw float64,
	height int,
	weight int,
	bodyFatPercent float64,
	visceralFat int,
	musclePercent float64,
	systolic int,
	diastolic int,
	bmr int,
	leftGripStrength float64,
	rightGripStrength float64,
	bodyAge int,
) error {
	query := `
		INSERT INTO tb_bioimpedances (
			student_id,
			tbw,
			height,
			weight,
			body_fat_percent,
			visceral_fat,
			muscle_percent,
			systolic,
			diastolic,
			bmr,
			left_grip_strength,
			right_grip_strength,
			body_age
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	_, err := br.db.Conn.Exec(
		query,
		studentID,
		tbw,
		height,
		weight,
		bodyFatPercent,
		visceralFat,
		musclePercent,
		systolic,
		diastolic,
		bmr,
		leftGripStrength,
		rightGripStrength,
		bodyAge,
	)

	if err != nil {
		return err
	}

	return nil
}
