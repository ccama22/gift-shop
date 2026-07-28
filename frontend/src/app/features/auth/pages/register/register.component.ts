import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  formData = signal<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  passwordStrength = signal<'weak' | 'medium' | 'strong' | null>(null);

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(value => !value);
  }

  onFirstNameChange(firstName: string): void {
    this.formData.update(data => ({ ...data, firstName }));
    this.errorMessage.set(null);
  }

  onLastNameChange(lastName: string): void {
    this.formData.update(data => ({ ...data, lastName }));
    this.errorMessage.set(null);
  }

  onEmailChange(email: string): void {
    this.formData.update(data => ({ ...data, email }));
    this.errorMessage.set(null);
  }

  onPasswordChange(password: string): void {
    this.formData.update(data => ({ ...data, password }));
    this.errorMessage.set(null);
    this.updatePasswordStrength(password);
  }

  onConfirmPasswordChange(confirmPassword: string): void {
    this.formData.update(data => ({ ...data, confirmPassword }));
    this.errorMessage.set(null);
  }

  onAcceptTermsChange(acceptTerms: boolean): void {
    this.formData.update(data => ({ ...data, acceptTerms }));
    this.errorMessage.set(null);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    const { firstName, lastName, email, password, confirmPassword, acceptTerms } = this.formData();

    // Validaciones
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage.set('Por favor ingresa un email válido');
      return;
    }

    if (password.length < 8) {
      this.errorMessage.set('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    if (!acceptTerms) {
      this.errorMessage.set('Debes aceptar los términos y condiciones');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Call auth service
    this.authService.register({ email, password, firstName, lastName }).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response.user);
        // Redirect to home page after successful registration
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Registration error:', error);
        this.errorMessage.set(error.message || 'Error al crear la cuenta');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  async onGoogleRegister(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('Registro con Google no disponible aún');
    this.isLoading.set(false);
    // TODO: Implementar registro con Google
  }

  async onFacebookRegister(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('Registro con Facebook no disponible aún');
    this.isLoading.set(false);
    // TODO: Implementar registro con Facebook
  }

  // Helpers
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private updatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength.set(null);
      return;
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    const strength = 
      length >= 12 && hasLowerCase && hasUpperCase && hasNumbers && hasSpecialChar ? 'strong' :
      length >= 8 && ((hasLowerCase && hasUpperCase) || (hasNumbers && hasSpecialChar)) ? 'medium' :
      'weak';

    this.passwordStrength.set(strength);
  }
}
