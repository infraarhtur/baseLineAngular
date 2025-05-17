import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProvidersService } from '../../services/providers.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
@Component({
  selector: 'app-create-providers',
  standalone: false,
  templateUrl: './create-providers.component.html',
  styleUrl: './create-providers.component.scss'
})
export class CreateProvidersComponent {
  @Input() clientData?: any;
  @Output() formSubmitted = new EventEmitter<any>();
  constructor(private fb: FormBuilder,
    private snackbar: SnackbarService,
    private providersService: ProvidersService, // Inyectamos el servicio
    private router: Router // Para redirigir después de guardar
  ) {}


  createProvider(formData: any): void {
    this.providersService.createProvider(formData).subscribe({
      next: () => {
        this.snackbar.success('✅ Provider creado con éxito')
        this.router.navigate(['/providers/select']);
      },
      error: (error) => {
        console.error('Error al crear provider:', error);
        this.snackbar.error('❌ Ocurrió un error al crear el provider.');
      }
    });

}
}
