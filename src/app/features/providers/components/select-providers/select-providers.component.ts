import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProvidersService } from '../../services/providers.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core'

@Component({
  selector: 'app-select-providers',
  standalone: false,
  templateUrl: './select-providers.component.html',
  styleUrl: './select-providers.component.scss'
})
export class SelectProvidersComponent implements  OnInit, AfterViewInit {
  displayedColumns: string[] = [ 'actions', 'name','phone','email','address']; // ✅ Columnas de la tabla

  providers: any[] = []; // Lista de providers
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator
    constructor(
      private providersService: ProvidersService,
      private router: Router,
      private dialog: MatDialog,
      private snackbar: SnackbarService,
    ) {}
  ngOnInit(): void {
    this.loadProviders();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadProviders(): void {
    this.providersService.getAllProviders().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log('Proveedores cargados:', this.dataSource.data );
        this.snackbar.success('Proveedores cargados');
            },
      error: (err) => {
        this.snackbar.error('Error al obtener proveedores');
        console.error('Error al obtener proveedores', err);
      }
    });
  }

  deleteProvider(id: string,name:string): void {
    console.log('Eliminar proveedores con ID:', id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { message: `¿Estás seguro de que deseas eliminar el proveedor \n ${name} ?  ` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.providersService.deleteProvider(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(c => c.id !== id); // Actualiza la tabla
            console.log('proveedores eliminado correctamente');
            this.snackbar.success('proveedor eliminado correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar el proveedor', err);
            this.snackbar.error('Error al eliminar el proveedor');
          }
        });
      }
    });
    // Aquí puedes llamar a un servicio para eliminar el proveedores
  }

  updateProvider(id: number): void {
    console.log('actualizar providerp con ID:', id);
    this.router.navigate(['/providers/update', id]);
    // Aquí puedes llamar a un servicio para eliminar el proveedores
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}
