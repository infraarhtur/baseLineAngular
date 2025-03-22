import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-select-clients',
  standalone: false,
  templateUrl: './select-clients.component.html',
  styleUrl: './select-clients.component.scss'
})
export class SelectClientsComponent implements OnInit {

  displayedColumns: string[] = ['select', 'nombre', 'telefono', 'email','direccion','comentario', 'acciones']; // ✅ Columnas de la tabla

  clients: any[] = []; // Lista de clientes
  selection = new SelectionModel<any>(true, []);

  constructor(private clientsService: ClientsService, private router: Router, private dialog: MatDialog) {}

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


  deleteClient(id: string,name:string, email:string): void {
    console.log('Eliminar cliente con ID:', id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { message: `¿Estás seguro de que deseas eliminar el cliente \n ${name} con email ${email}?  ` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí iría la lógica para eliminar el cliente
        console.log('Cliente confirmado para eliminar:', id);
        // this.clientsService.deleteClient(clientId).subscribe(...);
      }
    });
    // Aquí puedes llamar a un servicio para eliminar el cliente
  }

  updateClient(id: number): void {
    console.log('actualizar cliente con ID:', id);
    this.router.navigate(['/clients/update', id]);
    // Aquí puedes llamar a un servicio para eliminar el cliente
  }

  /** Si la cantidad de seleccionados es igual a la cantidad total de filas, retorna true */
  isAllSelected() {
    return this.selection.selected.length === this.clients.length;
  }


  /** Selecciona o deselecciona todas las filas */
  toggleAllRows() {
    this.isAllSelected() ? this.selection.clear() : this.clients.forEach(row => this.selection.select(row));
  }
}
