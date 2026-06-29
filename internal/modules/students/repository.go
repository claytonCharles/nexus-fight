package students

import (
	"database/sql"
	"errors"
	"fmt"
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

func (sr *StudentRepository) ListStudents(page int, perPage int) ([]models.Student, int, error) {
	limit := page * perPage
	offset := (page - 1) * perPage
	query := `SELECT * FROM tb_students WHERE active = 1 LIMIT ? OFFSET ?`
	queryCount := `SELECT COUNT(id) as total FROM tb_students WHERE active = 1`

	rows, err := sr.db.Conn.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var total int
	err = sr.db.Conn.QueryRow(queryCount).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

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
			return nil, 0, err
		}

		students = append(students, student)
	}

	return students, total, nil
}

func (sr *StudentRepository) GetStudentByID(id string) (*models.Student, error) {
	var student models.Student
	query := "SELECT * FROM tb_students WHERE id = ? AND active = 1 LIMIT 1"
	err := sr.db.Conn.QueryRow(query, id).Scan(
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
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}

	return &student, nil
}

func (sr *StudentRepository) ValidateStudentData(email *string, phone *string, cpf *string, id *string) error {
	baseQuery := "SELECT EXISTS(SELECT 1 FROM tb_students WHERE %s = ?)"
	if id != nil {
		baseQuery = "SELECT EXISTS(SELECT 1 FROM tb_students WHERE %s = ? AND id != ?)"
	}

	var exists bool
	if email != nil {
		err := sr.db.Conn.QueryRow(fmt.Sprintf(baseQuery, "email"), *email, id).Scan(&exists)
		if err != nil {
			return err
		}

		if exists {
			return ErrEmailAlreadyExists
		}
	}

	if phone != nil {
		err := sr.db.Conn.QueryRow(fmt.Sprintf(baseQuery, "phone"), *phone, id).Scan(&exists)
		if err != nil {
			return err
		}

		if exists {
			return ErrPhoneAlreadyExists
		}
	}

	if cpf != nil {
		err := sr.db.Conn.QueryRow(fmt.Sprintf(baseQuery, "cpf"), *cpf, id).Scan(&exists)
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

func (sr *StudentRepository) UpdateStudent(
	uuid string,
	name string,
	email *string,
	phone *string,
	cpf *string,
	gender string,
	headquarters string,
	birthday *time.Time,
) error {
	query := `
		UPDATE tb_students SET
			name = ?,
			email = ?,
			phone = ?,
			cpf = ?,
			gender = ?,
			headquarters = ?,
			birthday = ?,
			updated_at = ?
		WHERE id = ?
	`

	_, err := sr.db.Conn.Exec(query, name, email, phone, cpf, gender, headquarters, birthday, time.Now(), uuid)
	if err != nil {
		return err
	}

	return nil
}

func (sr *StudentRepository) DeactivateStudent(uuid string) error {
	_, err := sr.db.Conn.Exec("UPDATE tb_students SET active = 0 WHERE id = ?", uuid)
	if err != nil {
		return err
	}

	return nil
}
