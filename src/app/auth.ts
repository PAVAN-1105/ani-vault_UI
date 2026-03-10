import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:3000/api';

  currentUserSignal = signal<boolean>(!!localStorage.getItem('token')); 
  
  // --- TOAST NOTIFICATION SIGNALS ---
  toastMessage = signal<string | null>(null);
  isError = signal<boolean>(false);

  // Helper to trigger the toast from anywhere
  showToast(message: string, error: boolean = false) {
    this.toastMessage.set(message);
    this.isError.set(error);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 2000);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap({
        next: (response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token); 
            this.currentUserSignal.set(true); 
            this.showToast("Login Successful! Welcome back.");
          }
        },
        error: (err) => {
          this.showToast(err.error?.message || "Login failed!", true);
        }
      })
    );
  }

  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials).pipe(
      tap({
        next: () => this.showToast("Account created! You can now log in."),
        error: (err) => this.showToast(err.error?.message || "Registration failed!", true)
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token'); 
    this.currentUserSignal.set(false); 
    this.showToast("Logged out successfully.");
    this.router.navigate(['/login']); 
  }
}