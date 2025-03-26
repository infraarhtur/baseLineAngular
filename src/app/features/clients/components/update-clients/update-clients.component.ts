import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-update-clients',
  standalone: false,
  templateUrl: './update-clients.component.html',
  styleUrl: './update-clients.component.scss'
})
export class UpdateClientsComponent implements OnInit {
  clientId!: string; // ✅ Aquí se almacena el ID recibido
  clientData: any;

  constructor(
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private router: Router,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.clientId = String(params.get('id')); // ✅ Obtener el ID de la URL
      console.log('Cliente a actualizar:', this.clientId);
      this.loadClient();
    });
  }


  loadClient(): void {
    this.clientsService.getClientById(this.clientId).subscribe({
      next: (data) => {
        debugger
        this.clientData = data;
        console.log('Cliente adaptado para el formulario:', this.clientData);
      },
      error: (err) => {
        console.error('Error al cargar cliente:', err);
        this.snackbar.error('❌ No se pudo cargar el cliente');
      }
    });
  }

  updateClient(data: any): void {
    debugger
    this.clientsService.updateClient(this.clientId, data).subscribe({
      next: () => {
        this.snackbar.success('✅ Cliente actualizado con éxito');
        this.router.navigate(['/clients/select']);
      },
      error: (err) => {
        console.error('Error al actualizar cliente:', err);
        this.snackbar.error('❌ Ocurrió un error al actualizar el cliente');
      }
    });
  }
}
