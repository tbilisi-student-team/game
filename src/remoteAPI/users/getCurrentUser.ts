import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';;
import { CurrentUserData } from '@/types/index';

export function getCurrentUser() {
  return ypTechHTTPClient.get<CurrentUserData>('/auth/user', { withCredentials: true });
}
