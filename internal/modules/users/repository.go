package users

import (
	"database/sql"

	"github.com/claytonCharles/nexus-fight/internal/database"
	"github.com/claytonCharles/nexus-fight/internal/modules/users/models"
	"github.com/google/uuid"
)

type UserRepository struct {
	db *database.DB
}

func NewRepository(db *database.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (ur *UserRepository) ExistsUsers() (bool, error) {
	query := "SELECT EXISTS(SELECT 1 FROM tb_users WHERE active = 1)"

	var exists bool
	err := ur.db.Conn.QueryRow(query).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (ur *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	query := "SELECT * FROM tb_users WHERE email = ?"

	var user models.User
	if err := ur.db.Conn.QueryRow(query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Active,
		&user.CreatedAt,
		&user.UpdatedAt,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}

	return &user, nil
}

func (ur *UserRepository) CreateUser(name string, email string, passwordHash string) error {
	uuid := uuid.New()
	query := `INSERT INTO tb_users (id, name, email, password_hash) VALUES (?, ?, ?, ?)`

	_, err := ur.db.Conn.Exec(query, uuid, name, email, passwordHash)

	if err != nil {
		return err
	}

	return nil
}
