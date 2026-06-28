package database

import (
	"database/sql"
	"os"

	_ "modernc.org/sqlite"
)

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
