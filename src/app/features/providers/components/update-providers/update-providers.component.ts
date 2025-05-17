import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvidersService } from '../../services/providers.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-update-providers',
  standalone: false,
  templateUrl: './update-providers.component.html',
  styleUrl: './update-providers.component.scss'
})
export class UpdateProvidersComponent implements OnInit {
  providerId!: string; // ✅ Aquí se almacena el ID recibido
  providerData: any;
  constructor(
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private providersService: ProvidersService, // Inyectamos el servicio
    private router: Router // Para redirigir después de guardar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.providerId = String(params.get('id')); // ✅ Obtener el ID de la URL
      console.log('proveedor a actualizar:', this.providerId);
      this.loadProvider();
    });
  }

  loadProvider(): void {
    this.providersService.getProviderById(this.providerId).subscribe({
      next: (data) => {
        this.providerData = data;
        console.log('proveedor adaptado para el formulario:', this.providerData);
      },
      error: (err) => {
        console.error('Error al cargar proveedor:', err);
        this.snackbar.error('❌ No se pudo cargar el proveedor');
      }
    });
  }


  updateProvider(data: any): void {
    this.providersService.updateProvider(this.providerId, data).subscribe({
      next: () => {
        this.snackbar.success('✅ proveedor actualizado con éxito');
        this.router.navigate(['/clients/select']);
      },
      error: (err) => {
        console.error('Error al actualizar proveedor:', err);
        this.snackbar.error('❌ Ocurrió un error al actualizar el proveedor');
      }
    });
  }

}
