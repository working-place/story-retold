import type {
  LoginRequest,
  LoginResponse,
  LoginResponseRaw,
  SendRestoreCodeRequest,
  RestorePasswordRequest,
  ChangePasswordRequest,
} from '../../types/auth.types';
import { httpClient } from '../http.client';
import { setToken } from '../../utils/authStorage';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const params = new URLSearchParams({
      email: credentials.email,
      password: credentials.password,
    }).toString();
    const url = `/api/login?${params}`;

    // Типизируем ответ сервера строго
    const rawResponse = await httpClient<LoginResponseRaw>(url, {
      method: 'POST',
      skipAuth: true,
    });

    // Сервер гарантированно возвращает access_token
    const token = rawResponse.access_token;
    if (!token) {
      throw new Error('Сервер не вернул access_token');
    }

    setToken(token);
    return { token };
  },

  sendRestoreCode: (data: SendRestoreCodeRequest): Promise<void> => {
    const params = new URLSearchParams({ email: data.email }).toString();
    return httpClient<void>(`/api/send-restore-code?${params}`, {
      method: 'PATCH',
      skipAuth: true,
    });
  },

  restorePassword: (data: RestorePasswordRequest): Promise<void> => {
    const params = new URLSearchParams({
      password: data.password,
      password_confirmation: data.password_confirmation,
    }).toString();
    return httpClient<void>(`/api/restore/${data.token}/?${params}`, {
      method: 'PATCH',
      skipAuth: true,
    });
  },

  changePassword: (data: ChangePasswordRequest): Promise<void> => {
    const params = new URLSearchParams({
      password: data.password,
      password_confirmation: data.password_confirmation,
    }).toString();
    return httpClient<void>(`/api/change-admin-password?${params}`, {
      method: 'PATCH',
    });
  },
};