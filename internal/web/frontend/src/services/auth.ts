import axios from "axios";
import api from "@/lib/api";

type LoginPayload = {
  email: string;
  password: string;
};

type SetupFirstUserPayload = {
  name: string;
  email: string;
  password: string;
};

type CanRegisterResponse = {
  can_register: boolean;
};

type AuthUserPayload = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

export async function login(payload: LoginPayload): Promise<void> {
  try {
    await api.post<void>("/auth/login", payload);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data;
      if (typeof serverMessage === "string" && serverMessage.trim()) {
        throw new Error(serverMessage);
      }

      throw new Error("Não foi possível entrar no sistema.");
    }

    throw new Error("Erro inesperado.");
  }
}

export async function logout(): Promise<void> {
  try {
    await api.get<void>("/auth/logout");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Não foi possível sair do sistema.");
    }

    throw new Error("Erro inesperado.");
  }
}

export async function setupFirstUser(
  payload: SetupFirstUserPayload,
): Promise<void> {
  try {
    await api.post<void>("/user/setup", payload);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data;
      if (typeof serverMessage === "string" && serverMessage.trim()) {
        throw new Error(serverMessage);
      }

      throw new Error("Não foi possível criar o primeiro usuário.");
    }

    throw new Error("Erro inesperado.");
  }
}

export async function canRegister(): Promise<CanRegisterResponse> {
  try {
    const { data } = await api.get<CanRegisterResponse>("/auth/can-register");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Não foi possível verificar o cadastro.");
    }

    throw new Error("Erro inesperado.");
  }
}

export async function me(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get<AuthUserPayload>("/auth/me");

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      active: data.active,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return null;
    }

    throw new Error("Não foi possível carregar os dados do usuário.");
  }
}
