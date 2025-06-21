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


@Component({
  selector: 'app-select-sales',
  standalone: false,
  templateUrl: './select-sales.component.html',
  styleUrl: './select-sales.component.scss'
})
export class SelectSalesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [ 'actions','client','client.email','sale_date', 'total_amount', 'status','payment_method','comment']; // ✅ Columnas de la tabla

  sales: any[] = []; // Lista de ventas
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private salesService: SalesService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}
  ngOnInit(): void {
    this.loadSales();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

    loadSales(): void {
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log('Ventass cargadas:', this.dataSource.data );
        this.snackbar.success('Ventas cargados');
            },
      error: (err) => {
        this.snackbar.error('Error al obtener clientes');
        console.error('Error al obtener clientes', err);
      }
    });
  }

  deleteSale(sale_id:any): void{
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




}
