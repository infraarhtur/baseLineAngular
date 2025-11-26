import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../../service/administration.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-companies',
  standalone: false,
  templateUrl: './create-companies.component.html',
  styleUrl: './create-companies.component.scss'
})
export class CreateCompaniesComponent implements OnInit {
  companyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdministrationService,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.companyForm = this.fb.group({
      company_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      user_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      user_email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]]
    });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;
      console.log('Datos a enviar:', formData);
      this.adminService.createCompany(formData).subscribe({
        next: (data) => {
          console.log('Empresa creada con éxito', data);
          this.snackbar.success('✅ Empresa creada con éxito');
          setTimeout(() => {
            this.router.navigate(['/administration/select-companies']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al crear empresa:', error);
          console.error('Error completo:', JSON.stringify(error, null, 2));
          
          // Mostrar mensajes de error más detallados
          let errorMessage = 'Ocurrió un error al crear la empresa';
          
          if (error.error) {
            // Si hay errores de validación del backend
            if (error.error.detail) {
              if (Array.isArray(error.error.detail)) {
                // Si es un array de errores de validación
                errorMessage = error.error.detail.map((err: any) => {
                  if (err.loc && err.msg) {
                    return `${err.loc.join('.')}: ${err.msg}`;
                  }
                  return err.msg || JSON.stringify(err);
                }).join(', ');
              } else {
                errorMessage = error.error.detail;
              }
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
          }
          
          this.snackbar.error('❌ ' + errorMessage);
        }
      });
    } else {
      this.companyForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.router.navigate(['/administration/select-companies']);
  }
}
