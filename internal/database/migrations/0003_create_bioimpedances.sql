CREATE TABLE IF NOT EXISTS tb_bioimpedances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    tbw REAL NOT NULL,
    height INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    body_fat_percent REAL NOT NULL,
    visceral_fat INTEGER NOT NULL,
    muscle_percent REAL NOT NULL,
    systolic INTEGER NOT NULL,
    diastolic INTEGER NOT NULL,
    bmr INTEGER NOT NULL,
    left_grip_strength REAL NOT NULL,
    right_grip_strength REAL NOT NULL,
    body_age INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_bioimpedance_student FOREIGN KEY (student_id) REFERENCES tb_students (id)
);