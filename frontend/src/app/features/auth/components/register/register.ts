import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess: string | null = null;

  genderOptions = ['Male', 'Female', 'Other'];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        fullname: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern(/^[a-zA-Z\s]+$/),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
            this.passwordStrengthValidator,
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required, this.ageValidator]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { underage: true };
  }

  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.registerForm.get(fieldName);
    if (!field) {
      return false;
    }

    if (errorType) {
      return !!(field.hasError(errorType) && (field.dirty || field.touched));
    }

    return !!(field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors) {
      return '';
    }

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (field.hasError('minlength')) {
      const minLength = field.errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }

    if (field.hasError('maxlength')) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must not exceed ${maxLength} characters`;
    }

    if (field.hasError('pattern')) {
      if (fieldName === 'fullname') {
        return 'Full name should only contain letters and spaces';
      }
      if (fieldName === 'email') {
        return 'Please enter a valid email address';
      }
    }

    if (field.hasError('passwordStrength')) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (field.hasError('underage')) {
      return 'You must be at least 18 years old to register';
    }

    return 'Invalid input';
  }

  hasPasswordMismatch(): boolean {
    return !!(
      this.registerForm.hasError('passwordMismatch') &&
      this.registerForm.get('confirmPassword')?.dirty
    );
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullname: 'Full name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      gender: 'Gender',
      dateOfBirth: 'Date of birth',
    };
    return labels[fieldName] || fieldName;
  }

  onSubmit(): void {
    this.submitError = null;
    this.submitSuccess = null;

    Object.keys(this.registerForm.controls).forEach((key) => {
      this.registerForm.get(key)?.markAsTouched();
    });

    if (this.registerForm.invalid) {
      this.submitError = 'Please correct the errors in the form';
      return;
    }

    this.isSubmitting = true;

    const formData = {
      fullname: this.registerForm.value.fullname.trim(),
      email: this.registerForm.value.email.trim().toLowerCase(),
      password: this.registerForm.value.password,
      gender: this.registerForm.value.gender,
      dateOfBirth: this.registerForm.value.dateOfBirth,
    };

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitSuccess = 'Registration successful! Redirecting to dashboard...';

        this.registerForm.reset();

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = error.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      },
    });
  }

  resetForm(): void {
    this.registerForm.reset();
    this.submitError = null;
    this.submitSuccess = null;
  }
}
