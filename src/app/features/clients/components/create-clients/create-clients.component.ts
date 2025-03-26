
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';


@Component({
  selector: 'app-create-clients',
  standalone: false,
  templateUrl: './create-clients.component.html',
  styleUrl: './create-clients.component.scss'
})
export class CreateClientsComponent {

  @Input() clientData?: any;
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
    private snackbar: SnackbarService,
    private clientsService: ClientsService, // Inyectamos el servicio
    private router: Router // Para redirigir después de guardar
  ) {}

  createClient(formData: any): void {
    debugger
    this.clientsService.createClient(formData).subscribe({
      next: () => {
        this.snackbar.success('✅ Cliente creado con éxito')
        this.router.navigate(['/clients/select']);
      },
      error: (error) => {
        console.error('Error al crear cliente:', error);
        this.snackbar.error('❌ Ocurrió un error al crear el cliente.');
      }
    });

}
}
