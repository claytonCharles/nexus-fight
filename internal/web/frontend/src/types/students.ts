export type Student = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  gender: string;
  headquarters: string;
  birthday: string;
  active: number;
  created_at: Date;
  updated_at: Date;
};

export interface CreateStudentDTO {
  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  gender: "M" | "F";
  headquarters: string;
  birthday: string;
}

export interface StudentListResponse {
  list_student: Student[];
  page: number;
  per_page: number;
  total: number;
}