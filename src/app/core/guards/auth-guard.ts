import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../modules/auth/services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  // 1. Inject the AuthService to check the signal and Router for redirection
  const authService = inject(AuthService);
  const router = inject(Router);

  // 2. Check the signal (which we initialized from localStorage in the service)
  if (authService.currentUserSignal()) {
    return true; // Door is open!
  } else {
    // 3. User isn't logged in. Redirect to the modular login route
    // We use the full path /auth/login because of your modular setup
    router.navigate(['/auth/login']);
    return false; // Keep the door closed
  }
};