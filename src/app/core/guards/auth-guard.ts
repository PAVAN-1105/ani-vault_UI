import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../modules/auth/services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  // 1. Inject our tools
  const authService = inject(AuthService);
  const router = inject(Router);

  // 2. Check if the user is logged in
  if (authService.currentUserSignal()) {
    return true; // The door opens!
  } else {
    // 3. If no token, redirect to login page and keep the door closed
    router.navigate(['/login']);
    return false;
  }
};