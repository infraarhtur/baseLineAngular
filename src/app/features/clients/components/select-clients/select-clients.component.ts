import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-select-clients',
  standalone: false,
  templateUrl: './select-clients.component.html',
  styleUrl: './select-clients.component.scss'
})
export class SelectClientsComponent implements OnInit {
  clients: any[] = []; // Lista de clientes

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        console.log('Clientes cargados:', this.clients);
      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });
  }
}
