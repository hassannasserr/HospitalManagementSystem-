import { Component } from '@angular/core';
import { FormBuilder, Validators,FormGroup , ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LoginPayload } from '../../interfaces/auth';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-doctor-login',
  standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-login.html',
  styleUrls: ['./doctor-login.css'] 
})
export class DoctorLoginComponent {
  loginForm!: FormGroup;   // declare but don’t initialize
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    // initialize form here
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const payload: LoginPayload = this.loginForm.value;

    this.auth.login(payload).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        this.router.navigateByUrl(res.redirectTo || '/doctor/dashboard');
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Login failed';
        this.loading = false;
      }
    });
  }
}