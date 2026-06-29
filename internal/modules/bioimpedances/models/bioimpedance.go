package models

import "time"

type Bioimpedance struct {
	ID                int       `json:"id"`
	StudentID         string    `json:"student_id"`
	TBW               float64   `json:"tbw"`
	Height            int       `json:"height"`
	Weight            int       `json:"weight"`
	BodyFatPercent    float64   `json:"body_fat_percent"`
	VisceralFat       int       `json:"visceral_fat"`
	MusclePercent     float64   `json:"muscle_percent"`
	Systolic          int       `json:"systolic"`
	Diastolic         int       `json:"diastolic"`
	BMR               int       `json:"bmr"`
	LeftGripStrength  float64   `json:"left_grip_strength"`
	RightGripStrength float64   `json:"right_grip_strength"`
	BodyAge           int       `json:"body_age"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}
