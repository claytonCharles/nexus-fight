export type Bioimpedance = {
  id: number;
  student_id: string;
  tbw: number;
  height: number;
  weight: number;
  body_fat_percent: number;
  visceral_fat: number;
  muscle_percent: number;
  systolic: number;
  diastolic: number;
  bmr: number;
  left_grip_strength: number;
  right_grip_strength: number;
  body_age: number;
  created_at: string;
  updated_at: string;
};

export interface CreateBioimpedanceDTO {
  student_id: string;
  tbw: number;
  height: number;
  weight: number;
  body_fat_percent: number;
  visceral_fat: number;
  muscle_percent: number;
  systolic: number;
  diastolic: number;
  bmr: number;
  left_grip_strength: number;
  right_grip_strength: number;
  body_age: number;
}
