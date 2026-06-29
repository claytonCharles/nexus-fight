import axios from "axios";
import api from "@/lib/api";
import type { CreateStudentDTO, Student, StudentListResponse } from "@/types/students";

export async function listStudents(page = 1, search = ""): Promise<StudentListResponse> {
  try {
    const { data } = await api.get<StudentListResponse>("/student/list", {
      params: { page, search },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Não foi possível carregar os alunos.");
    }

    throw new Error("Erro inesperado.");
  }
}

export async function getStudent(id: string): Promise<Student> {
  try {
    const { data } = await api.get<Student>("/student/show", {
      params: { id },
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Não foi possível carregar o aluno.");
    }

    throw new Error("Erro inesperado.");
  }
}

export async function createStudent(data: CreateStudentDTO): Promise<string> {
  try {
    const response = await api.post<string>("/student/create", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }

    throw new Error("Erro inesperado.");
  }
}

export async function updateStudent(id: string, data: CreateStudentDTO): Promise<string> {
  try {
    const response = await api.post<string>("/student/update", data, {
      params: { id },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }

    throw new Error("Erro inesperado.");
  }
}

export async function deactivateStudent(id: string): Promise<string> {
  try {
    const response = await api.delete<string>("/student/delete", {
      params: { id },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data;
      if (typeof serverMessage === "string" && serverMessage.trim()) {
        throw new Error(serverMessage);
      }

      throw new Error("Não foi possível remover o aluno.");
    }

    throw new Error("Erro inesperado.");
  }
}