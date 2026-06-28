package students

import (
	"database/sql"
	"errors"
	"time"

	"github.com/claytonCharles/nexus-fight/internal/database"
	"github.com/claytonCharles/nexus-fight/internal/modules/students/models"
	"github.com/claytonCharles/nexus-fight/pkg/nexus/logger"
	"github.com/google/uuid"
)

type StudentRepository struct {
	db *database.DB
}

var (
	ErrEmailAlreadyExists = errors.New("Email already exists!")
	ErrPhoneAlreadyExists = errors.New("Phone already exists!")
	ErrCPFAlreadyExists   = errors.New("CPF already exists!")
)

func NewRepository(db *database.DB, log *logger.Logger) *StudentRepository {
	return &StudentRepository{
		db: db,
	}
}

func (sr *StudentRepository) ListStudents() ([]models.Student, error) {
	query := `SELECT * FROM tb_students WHERE active = 1`

	rows, err := sr.db.Conn.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var students []models.Student
	for rows.Next() {
		var student models.Student
		if err := rows.Scan(
			&student.ID,
			&student.Name,
			&student.Email,
			&student.Phone,
			&student.CPF,
			&student.Gender,
			&student.Headquarters,
			&student.Birthday,
			&student.Active,
			&student.CreatedAt,
			&student.UpdatedAt,
		); err != nil {
			return nil, err
		}

		students = append(students, student)
	}

	return students, nil
}

func (sr *StudentRepository) ValidedStudentData(email string, phone string, cpf string) error {
	query := `
		SELECT
			email = ? AS email_exists,
			phone = ? AS phone_exists,
			cpf = ? AS cpf_exists
		FROM tb_students
		WHERE email = ?
		OR phone = ?
		OR cpf = ?
		LIMIT 1
	`

	row := sr.db.Conn.QueryRow(query, email, phone, cpf, email, phone, cpf)

	var emailExists, phoneExists, cpfExists bool

	err := row.Scan(&emailExists, &phoneExists, &cpfExists)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		return err
	}

	if emailExists {
		return ErrEmailAlreadyExists
	}

	if phoneExists {
		return ErrPhoneAlreadyExists
	}

	if cpfExists {
		return ErrCPFAlreadyExists
	}

	return nil
}

func (sr *StudentRepository) CreateStudent(
	name string,
	email *string,
	phone *string,
	cpf *string,
	gender string,
	headquarters string,
	birthday *time.Time,
) error {
	uuid := uuid.New()
	query := `
		INSERT INTO tb_students (id, name, email, phone, cpf, gender, headquarters, birthday)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`

	_, err := sr.db.Conn.Exec(query, uuid, name, email, phone, cpf, gender, headquarters, birthday)

	if err != nil {
		return err
	}

	return nil
}
