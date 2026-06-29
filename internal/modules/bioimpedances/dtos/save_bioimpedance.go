package dtos

type SaveBioimpedanceDTO struct {
	StudentID         string  `json:"student_id" rules:"required"`
	TBW               float64 `json:"tbw" rules:"required"`
	Height            int     `json:"height" rules:"required"`
	Weight            int     `json:"weight" rules:"required"`
	BodyFatPercent    float64 `json:"body_fat_percent" rules:"required"`
	VisceralFat       int     `json:"visceral_fat" rules:"required"`
	MusclePercent     float64 `json:"muscle_percent" rules:"required"`
	Systolic          int     `json:"systolic" rules:"required"`
	Diastolic         int     `json:"diastolic" rules:"require"`
	BMR               int     `json:"bmr" rules:"required"`
	LeftGripStrength  float64 `json:"left_grip_strength" rules:"required"`
	RightGripStrength float64 `json:"right_grip_strength" rules:"required"`
	BodyAge           int     `json:"body_age" rules:"required"`
}
