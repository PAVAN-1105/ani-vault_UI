import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // 1. Turn the spinner ON as the request leaves the app
  loadingService.isLoading.set(true);

  return next(req).pipe(
    // 2. RxJS 'finalize' runs when the stream completes (Success OR Error)
    finalize(() => {
      // Turn the spinner OFF when the backend responds
      loadingService.isLoading.set(false);
    })
  );
};