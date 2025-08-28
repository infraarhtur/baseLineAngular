import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-password-reset-confirm',
  standalone: false,
  templateUrl: './password-reset-confirm.component.html',
  styleUrl: './password-reset-confirm.component.scss'
})
export class PasswordResetConfirmComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  isLoading: boolean = false;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.hasUppercaseValidator, this.hasNumberValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Obtener el token desde la URL
    this.route.params.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.snackBar.open('Token de restablecimiento no válido', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/login']);
      }
    });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  // Validador para verificar que la contraseña tenga al menos una mayúscula
  hasUppercaseValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    if (password && !/[A-Z]/.test(password)) {
      return { 'noUppercase': true };
    }
    return null;
  }

  // Validador para verificar que la contraseña tenga al menos un número
  hasNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    if (password && !/\d/.test(password)) {
      return { 'noNumber': true };
    }
    return null;
  }

  // Obtener errores de validación para mostrar en el template
  getPasswordErrors(): string {
    const passwordControl = this.resetForm.get('password');
    if (passwordControl?.errors) {
      if (passwordControl.errors['required']) return 'La contraseña es requerida';
      if (passwordControl.errors['minlength']) return 'La contraseña debe tener al menos 8 caracteres';
      if (passwordControl.errors['noUppercase']) return 'La contraseña debe tener al menos una mayúscula';
      if (passwordControl.errors['noNumber']) return 'La contraseña debe tener al menos un número';
    }
    return '';
  }

  getConfirmPasswordErrors(): string {
    const confirmPasswordControl = this.resetForm.get('confirmPassword');
    if (confirmPasswordControl?.errors) {
      if (confirmPasswordControl.errors['required']) return 'Confirma tu contraseña';
    }
    return '';
  }

  getPasswordMismatchError(): string {
    if (this.resetForm.errors?.['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.token) {
      this.isLoading = true;

      const { password } = this.resetForm.value;

      // Aquí deberías llamar al servicio de autenticación
      this.authService.resetPasswordConfirm(this.token, password).subscribe({
        next: (data) => {
          console.log(data);
          debugger;
        this.snackbarService.success(data.message);
        },error: (error) => {
          console.log(error);
          this.snackBar.open(error.error.message, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });

      // this.authService.resetPassword(this.token, password).subscribe({
      //   next: (response) => {
      //     this.snackBar.open('Contraseña actualizada exitosamente', 'Cerrar', {
      //       duration: 5000,
      //       panelClass: ['success-snackbar']
      //     });
      //     this.router.navigate(['/login']);
      //   },
      //   error: (error) => {
      //     this.snackBar.open('Error al actualizar la contraseña', 'Cerrar', {
      //       duration: 5000,
      //       panelClass: ['error-snackbar']
      //     });
      //     this.isLoading = false;
      //   }
      // });

      // Simulación temporal del servicio
      setTimeout(() => {
        this.snackBar.open('Contraseña actualizada exitosamente', 'Cerrar', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/login']);
        this.isLoading = false;
      }, 2000);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  // Métodos para verificar validaciones en el template
  hasUppercase(value: string | null | undefined): boolean {
    return !!value && /[A-Z]/.test(value);
  }

  hasNumber(value: string | null | undefined): boolean {
    return !!value && /\d/.test(value);
  }
}
