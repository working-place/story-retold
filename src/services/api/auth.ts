import type {
  LoginRequest,
  LoginResponse,
  LoginResponseRaw,
  SendRestoreCodeRequest,
  RestorePasswordRequest,
  ChangePasswordRequest,
} from '../../types/api.types';
import { httpClient } from '../http.client';
import { setToken } from '../../utils/authStorage';
import { ENDPOINTS } from './api';

export const authApi = {
  /**
   * Логин. Учётные данные передаются в теле запроса (не в query string),
   * чтобы не попадать в логи сервера/прокси и историю браузера.
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const rawResponse = await httpClient<LoginResponseRaw>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      skipAuth: true,
      body: {
        email: credentials.email,
        password: credentials.password,
      },
    });

    const token = rawResponse.access_token;
    if (!token) {
      throw new Error('Сервер не вернул access_token');
    }

    setToken(token);
    return { token };
  },

  sendRestoreCode: (data: SendRestoreCodeRequest): Promise<void> => {
    return httpClient<void>(ENDPOINTS.AUTH.SEND_RESTORE_CODE, {
      method: 'PATCH',
      skipAuth: true,
      body: { email: data.email },
    });
  },

  restorePassword: (data: RestorePasswordRequest): Promise<void> => {
    return httpClient<void>(ENDPOINTS.AUTH.RESTORE(data.token), {
      method: 'PATCH',
      skipAuth: true,
      body: {
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
    });
  },

  changePassword: (data: ChangePasswordRequest): Promise<void> => {
    return httpClient<void>(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'PATCH',
      body: {
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
    });
  },
};
