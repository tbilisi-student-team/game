import { httpClient } from 'core';
import {CurrentUserData} from "types";

export function getCurrentUser() {
  return httpClient.get<CurrentUserData>('/auth/user', { withCredentials: true });
}
