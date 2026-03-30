import { CanMatchFn } from '@angular/router';

import { authService } from './auth.service';

export const authGuard: CanMatchFn = async () => {
  if (authService.isAuthenticated()) {
    return true;
  }

  await authService.login();
  return false;
};
