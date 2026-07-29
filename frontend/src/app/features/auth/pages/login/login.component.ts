import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Reactive signals for form state
  formData = signal<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Get return URL from query params - default to home page
  private returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  onEmailChange(email: string): void {
    this.formData.update(data => ({ ...data, email }));
    this.errorMessage.set(null);
  }

  onPasswordChange(password: string): void {
    this.formData.update(data => ({ ...data, password }));
    this.errorMessage.set(null);
  }

  onRememberMeChange(rememberMe: boolean): void {
    this.formData.update(data => ({ ...data, rememberMe }));
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    const { email, password } = this.formData();

    // Validación básica
    if (!email || !password) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage.set('Por favor ingresa un email válido');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Call auth service
    this.authService.login({ email, password }).subscribe({
      next: (response: any) => {
        // Redirect to admin dashboard after successful login
        this.router.navigate([this.returnUrl]);
      },
      error: (error: any) => {
        console.error('Login error:', error);
        this.errorMessage.set(error.message || 'Email o contraseña incorrectos');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  async onGoogleLogin(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('Login con Google no disponible aún');
    this.isLoading.set(false);
    // TODO: Implementar login con Google
  }

  async onFacebookLogin(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('Login con Facebook no disponible aún');
    this.isLoading.set(false);
    // TODO: Implementar login con Facebook
  }

  // Helpers
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
