import { AfterViewInit, Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core'


@Component({
  selector: 'app-select-clients',
  standalone: false,
  templateUrl: './select-clients.component.html',
  styleUrl: './select-clients.component.scss'
})
export class SelectClientsComponent implements OnInit, OnChanges, AfterViewInit {

  displayedColumns: string[] = this.isSelected
    ? ['select', 'name', 'phone', 'email', 'address', 'comment']
    : ['actions','name', 'phone', 'email', 'address', 'comment']; // ✅ Columnas de la tabla

  selectedClientId: string | null = null;
  clients: any[] = []; // Lista de clientes
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();
  @Input() isSelected?: boolean = false;
  @Output() selectedClientChange = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private clientsService: ClientsService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.setDisplayedColumns();
    this.loadClients();

  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setDisplayedColumns()
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.snackbar.success('Clientes cargados');


      // ✅ Seleccionar el primer cliente si está en modo selección
      if (this.isSelected && data.length > 0) {
        const selectedClient = data.find((c: any) => c.email === 'unknown@gmail.com');
         if (selectedClient) {
          this.selectedClientId = selectedClient.id;
          this.selectClient(selectedClient.id);
        }

      }
      },
      error: (err) => {
        this.snackbar.error('Error al obtener clientes');
        console.error('Error al obtener clientes', err);
      }
    });
  }


  deleteClient(id: string, name: string, email: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { message: `¿Estás seguro de que deseas eliminar el cliente \n ${name} con email ${email}?  ` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientsService.deleteClient(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(c => c.id !== id); // Actualiza la tabla

            this.snackbar.success('Cliente eliminado correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar el cliente', err);
            this.snackbar.error('Error al eliminar el cliente');
          }
        });
      }
    });
    // Aquí puedes llamar a un servicio para eliminar el cliente
  }

  updateClient(id: number): void {

    this.router.navigate(['/clients/update', id]);
    // Aquí puedes llamar a un servicio para eliminar el cliente
  }

  /** Si la cantidad de seleccionados es igual a la cantidad total de filas, retorna true */
  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }


  /** Selecciona o deselecciona todas las filas */
  toggleAllRows() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }




  selectClient(clientId: string): void {
    this.selectedClientId = clientId;
    const selected = this.dataSource.data.find(c => c.id === clientId);
    this.selectedClientChange.emit(selected); // Emitir al padre si aplica
  }


  setDisplayedColumns(): void {
    this.displayedColumns = this.isSelected
      ? ['select', 'name', 'phone', 'email', 'address', 'comment']
      : [ 'actions', 'name', 'phone', 'email', 'address', 'comment'];
  }
}
