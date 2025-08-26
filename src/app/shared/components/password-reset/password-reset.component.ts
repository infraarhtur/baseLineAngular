import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  standalone: false,
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm!: FormGroup;
  submitting = false;

  constructor(private fb: FormBuilder) {}

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

      // Simulate API call
      setTimeout(() => {
        this.submitting = false;
        // TODO: Show success message or redirect
      }, 2000);
    }
  }
}
