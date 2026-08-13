import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/AuthService';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrls: ['./registration.css'],
})
export class Registration {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;

  constructor() {
    this.registrationForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get f() {
    return this.registrationForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.registrationForm.invalid) {
      return;
    }

    this.loading = true;
    const { username, email, password } = this.registrationForm.value;

    const userData = {
      username,
      email,
      password,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/medicines']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      },
    });
  }
}
