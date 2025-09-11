import { Component } from '@angular/core';
import { AdministrationService } from '../../service/administration.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

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
    private router: Router // Para redirigir después de guardar
  ) {}



  createUser(formData: any): void {
    console.log(formData);
    this.adminService.createUser(formData).subscribe({
      next: () => {
        this.snackbar.success('✅ Usuario creado con éxito');
        this.router.navigate(['/administration/select-user']);
      }
    });
  }
}
