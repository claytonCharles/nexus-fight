package database

import (
	"database/sql"
	"embed"
	"os"
	"strings"

	_ "modernc.org/sqlite"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

type DB struct {
	Conn *sql.DB
}

func InitializeDatabase() (*DB, error) {
	if err := os.MkdirAll("data/database", 0755); err != nil {
		return nil, err
	}

	db, err := sql.Open("sqlite", "data/database/nexus.db")
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}

	return &DB{
		Conn: db,
	}, nil
}

func (db *DB) AutoMigrate() error {
	if err := db.prepareMigrationEssentials(); err != nil {
		return err
	}

	files, err := migrationsFS.ReadDir("migrations")
	if err != nil {
		return err
	}

	tx, err := db.Conn.Begin()
	if err != nil {
		return err
	}

	for _, file := range files {
		if !strings.HasSuffix(file.Name(), ".sql") {
			continue
		}

		query, err := migrationsFS.ReadFile("migrations/" + file.Name())
		if err != nil {
			tx.Rollback()
			return err
		}

		name := strings.TrimSuffix(file.Name(), ".sql")
		exists, err := db.checkMigrations(tx, name)
		if err != nil {
			tx.Rollback()
			return err
		}

		if exists {
			continue
		}

		if _, err := tx.Exec(string(query)); err != nil {
			tx.Rollback()
			return err
		}

		if _, err := tx.Exec("INSERT INTO schema_migrations (name) VALUES (?)", name); err != nil {
			tx.Rollback()
			return err
		}

	}

	return tx.Commit()
}

func (db *DB) prepareMigrationEssentials() error {
	_, err := db.Conn.Exec(`
		PRAGMA foreign_keys = ON;
		CREATE TABLE IF NOT EXISTS schema_migrations(
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`)

	return err
}

func (db *DB) checkMigrations(tx *sql.Tx, name string) (bool, error) {
	var exists int
	query := "SELECT 1 FROM schema_migrations WHERE name = ?"
	err := tx.QueryRow(query, name).Scan(&exists)
	if err == sql.ErrNoRows {
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return true, nil
}
