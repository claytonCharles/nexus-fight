package students

import (
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

func (sr *StudentRepository) ValidateStudentData(email *string, phone *string, cpf *string) error {
	if email != nil {
		exists, err := sr.exists("SELECT EXISTS(SELECT 1 FROM tb_students WHERE email = ?)", *email)
		if err != nil {
			return err
		}

		if exists {
			return ErrEmailAlreadyExists
		}
	}

	if phone != nil {
		exists, err := sr.exists("SELECT EXISTS(SELECT 1 FROM tb_students WHERE phone = ?)", *phone)
		if err != nil {
			return err
		}

		if exists {
			return ErrPhoneAlreadyExists
		}
	}

	if cpf != nil {
		exists, err := sr.exists("SELECT EXISTS(SELECT 1 FROM tb_students WHERE cpf = ?)", *cpf)
		if err != nil {
			return err
		}

		if exists {
			return ErrCPFAlreadyExists
		}
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

func (sr *StudentRepository) exists(query string, value string) (bool, error) {
	var exists bool

	err := sr.db.Conn.QueryRow(query, value).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}
