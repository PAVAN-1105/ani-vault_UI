import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../modules/auth/services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. INJECT DEPENDENCIES
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  // 2. THE REQUEST INTERCEPTOR (Going Out)
  // If we have a token, clone the request and attach the header globally
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. THE RESPONSE INTERCEPTOR (Coming Back)
  // Pass the request forward, but listen for errors coming back
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If the backend says our token is expired or invalid...
      if (error.status === 401 || error.status === 403) {
        console.warn('Unauthorized request - logging out.');
        
        // Clear the bad token
        localStorage.removeItem('token');
        authService.currentUserSignal.set(false);
        
        // Boot them to the login screen
        router.navigate(['/login']);
        authService.showToast('Session expired. Please log in again.', true);
      }
      
      // Pass the error along so components can still handle it if needed
      return throwError(() => error);
    })
  );
};