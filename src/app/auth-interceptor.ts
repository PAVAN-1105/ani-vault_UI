import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Grab the VIP pass from the browser's pocket
  const token = localStorage.getItem('token');

  // 2. If we have a token, clone the request and attach it to the Headers
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // This matches what your Node backend is looking for!
      }
    });
    // 3. Send the modified request to the backend
    return next(authReq);
  }

  // 4. If no token (like if they aren't logged in), just send the normal request
  return next(req);
};