import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core'
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-select-sales',
  standalone: false,
  templateUrl: './select-sales.component.html',
  styleUrl: './select-sales.component.scss'
})
export class SelectSalesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['actions', 'client', 'client.email', 'sale_date', 'total_amount', 'status', 'payment_method', 'comment']; // ✅ Columnas de la tabla

  sales: any[] = []; // Lista de ventas
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();

  // paginacion
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // filters
  startDate: Date | null = null;
  endDate: Date | null = null;
  originalSales: any[] = []; // respaldo sin filtrar
  selectedStatus: string = ''; // Estado seleccionado para el filtro


  constructor(
    private salesService: SalesService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) { }
  ngOnInit(): void {
    this.loadSales();
  }
  ngAfterViewInit(): void {

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = `
    ${data.client?.name || ''}
    ${data.client?.email || ''}
    ${data.sale_date || ''}
    ${data.status || ''}
    ${data.payment_method || ''}
    ${data.total_amount || ''}
    ${data.comment || ''}
  `.toLowerCase();

    return dataStr.includes(filter);
    };

    this.sortConfigurations();
  }

  loadSales(): void {
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.originalSales = data;
        this.dataSource.data = data;

        this.sortConfigurations(); // Configura el sort y paginator después de cargar los datos

        console.log('Ventass cargadas:', this.dataSource.data);
        this.snackbar.success('Ventas cargados');
      },
      error: (err) => {
        this.snackbar.error('Error al obtener clientes');
        console.error('Error al obtener clientes', err);
      }
    });
  }

  deleteSale(sale_id: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { message: `¿Estás seguro de que deseas anular esta venta  \n ${sale_id} ?  ` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salesService.deleteSale(sale_id).subscribe({
          next: () => {
            this.loadSales();
            this.snackbar.success('Venta anulada correctamente');
          },
          error: (err) => {
            this.snackbar.error('Error al anular la venta');
            console.error('Error al anular la venta', err);
          }
        });
      }
    });

  }

  updateSale(sale_id: any): void {
    this.router.navigate(['/sales/update', sale_id]);
  }

  detailSale(sale_id: any): void {
    this.router.navigate(['/sales/detail', sale_id]);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyDateFilter(): void {
    const start = this.startDate ? new Date(this.startDate).setHours(0, 0, 0, 0) : null;
    const end = this.endDate ? new Date(this.endDate).setHours(23, 59, 59, 999) : null;
    this.dataSource.data = this.originalSales.filter(sale => {
      if (!sale.sale_date) return false;

      const saleDate = new Date(sale.sale_date).getTime();
      if (start && saleDate < start) return false;
      if (end && saleDate > end) return false;
      return true;
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  sortConfigurations (): void {

     // Espera un segundo para asegurarse de que el paginator y el sort estén listos
    // Esto es necesario porque a veces el paginator y el sort no están disponibles inmediatamente después de
    // la inicialización del componente, especialmente si se cargan datos de forma asíncr
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        if (property === 'sale_date') {
          return new Date(item.sale_date).getTime(); // Asegura que la fecha se ordene correctamente
        }
        if (property === 'client') {
          return item.client?.name?.toLowerCase() || '';
        }
        if (property === 'client.email') {
          return item.client?.email?.toLowerCase() || '';
        }
        return item[property];
      };
    }, (100));
  }

  applyStatusFilter(status: string): void {
    if (status === '') {
      this.dataSource.data = this.originalSales;
    } else {
      this.dataSource.data = this.originalSales.filter(sale => sale.status === status);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
