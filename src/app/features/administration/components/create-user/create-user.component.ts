import { Component } from '@angular/core';
import { AdministrationService } from '../../service/administration.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-create-user',
  standalone: false,
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {

  constructor(private fb: FormBuilder,
    private snackbar: SnackbarService,
    private adminService: AdministrationService, // Inyectamos el servicio
    private router: Router, // Para redirigir después de guardar
    private authService: AuthService // Inyectamos el servicio
  ) {}



  createUser(formData: any): void {
    this.adminService.createUser(formData).subscribe({
      next: () => {
        console.log('Usuario creado con éxito');
        this.snackbar.success('✅ Usuario creado con éxito');
        this.emailVerified(formData.email);
        setTimeout(() => {
          this.router.navigate(['/administration/select-user']);
        }, 3000);

      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        this.snackbar.error('❌ '+ error.error.detail);
      }
    });
  }

  emailVerified(email: string): void {
    this.authService.emailVerified(email).subscribe({
      next: () => {
        console.log('Email enviado con éxito');
        this.snackbar.success('✅  se envio el email de verificación')
      },
      error: (error) => {
        debugger
        console.error('Error enviar email:', error);
        this.snackbar.error('❌ Ocurrió un error al verificar el email.');
      }
    });
  }
}
