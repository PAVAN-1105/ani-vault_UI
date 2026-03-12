import { Component, inject } from '@angular/core'; 
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth'; // ✅ Updated path
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
})
export class LoginComponent {
  // Use modern inject pattern to match your App component
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = true; 

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.loginForm.reset(); 
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.authService.showToast("Please fill in the form correctly", true);
      return;
    }

    const credentials = this.loginForm.value;

    if (this.isLoginMode) {
      // --- THE LOGIN FLOW ---
      this.authService.login(credentials).subscribe({
        next: () => {
          // The Toast is already triggered inside authService.login() tap
          this.router.navigate(['/dashboard']); 
        },
        error: () => {
          // The error Toast is also handled in authService.login()
          // No alert needed!
        }
      });
    } else {
      // --- THE REGISTER FLOW ---
      this.authService.register(credentials).subscribe({
        next: () => {
          // Triggered by authService.register() tap
          this.isLoginMode = true; 
          this.loginForm.reset(); 
        },
        error: () => {
          // Handled by authService
        }
      });
    }
  }
}