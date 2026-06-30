import axios from "axios";
import api from "@/lib/api";
import type { Bioimpedance, CreateBioimpedanceDTO } from "@/types/bioimpedance";

export async function listBioimpedances(student_id: string): Promise<Bioimpedance[]> {
  try {
    const { data } = await api.get<Bioimpedance[]>("/bioimpedance/list", {
      params: { id: student_id },
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Não foi possível carregar as bioimpedâncias.");
    }

    throw new Error("Erro inesperado.");
  }
}

export async function createBioimpedance(data: CreateBioimpedanceDTO): Promise<string> {
  try {
    const response = await api.post<string>("/bioimpedance/create", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }

    throw new Error("Erro inesperado.");
  }
}
