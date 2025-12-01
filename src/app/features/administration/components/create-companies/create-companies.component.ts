import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../../service/administration.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Router } from '@angular/router';
import { ClientsService } from '../../../clients/services/clients.service';

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
    private router: Router,
    private clientService: ClientsService
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
          //crear  cliente UNKNOWN
          this.addInitialClient(data.company_id);

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
  addInitialClient( company_id: string ): void {
    this.clientService.createClient({
      name: 'Unknown',
      email: 'unknown@example.com',
      phone: '0000000000',
      address: 'Unknown',
      comment: 'Unknown es un cliente inicial anonimo creado en la creacion de la empresa',
      company_id: company_id,
      is_active: true,
      created_by: company_id,
      created_at: new Date().toISOString()


    }).subscribe({
      next: () => {
        console.log('Cliente creado con éxito');
      },
      error: (error) => {
        console.error('Error al crear cliente:', error);
      }
    });
  }

}
