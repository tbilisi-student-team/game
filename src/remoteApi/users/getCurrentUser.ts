import { httpClient } from 'core';

export function getCurrentUser() {
  return httpClient.get('/auth/user', { withCredentials: true });
}
