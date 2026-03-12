import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // A global signal that any component can read, but the interceptor controls
  isLoading = signal<boolean>(false);
}