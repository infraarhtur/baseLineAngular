import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-password-reset',
  standalone: false,
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm!: FormGroup;
  submitting = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    if (this.passwordResetForm.valid) {
      this.submitting = true;
      // TODO: Implement password reset logic here
      console.log('Password reset requested for:', this.passwordResetForm.value.email);
      this.authService.resetPassword(this.passwordResetForm.value.email).subscribe({
        next: (data) => {
          console.log(data);
          this.snackbarService.success(data.message);
          setTimeout(() => {
            this.router.navigate(['/login']);
       }, 5000);
        },
        error: (error) => {
          console.log(error);

          this.snackbarService.error('Error al enviar el enlace para restablecer tu contraseña');

        }
      });
      // Simulate API call

    }
  }
}
