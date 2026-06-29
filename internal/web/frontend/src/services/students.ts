import axios from "axios";
import api from "@/lib/api";
import type { CreateStudentDTO, Student } from "@/types/students";

export async function listStudents(): Promise<Student[]> {
  try {
    const { data } = await api.get<Student[]>("/student/list");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        "Não foi possível carregar os alunos."
      );
    }

    throw new Error("Erro inesperado.");
  }
}

export async function createStudent(data: CreateStudentDTO) {
  const response = await api.post("/student/create", data);
  return response.data;
}