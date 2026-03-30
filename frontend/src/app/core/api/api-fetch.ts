import { authService } from '../auth/auth.service';

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = await authService.getAccessToken();
  if (!token) {
    await authService.login();
    throw new Error('Session utilisateur requise.');
  }

  const headers = new Headers(init.headers ?? {});
  headers.set('Authorization', `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers,
  });
}
