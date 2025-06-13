import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-detail-sales',
  standalone: false,
  templateUrl: './detail-sales.component.html',
  styleUrl: './detail-sales.component.scss'
})
export class DetailSalesComponent implements OnInit, AfterViewInit {

   displayedColumns: string[] = ['product_name','quantity', 'subtotal', 'discount',  'total' ]; // ✅ Columnas de la tabla

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator

  saleId!: string; // ✅ Aquí se almacena el ID recibido
  providerData: any;
  constructor(
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private salesService: SalesService, // Inyectamos el servicio
    private router: Router // Para redirigir después de guardar
  ) { }

  saleData: any; // aquí se guardarán los datos completos de la venta
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.saleId = String(params.get('id')); // ✅ Obtener el ID de la URL
      console.log('Detalle de la venta:', this.saleId);
      this.loadSale();
    });
  }

    ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadSale(): void {
    this.salesService.getSaletById(this.saleId).subscribe({
      next: (data) => {
        this.saleData= data;
        this.dataSource.data = this.saleData.details; // Asignar los detalles de la venta a la fuente de datos
        console.log('Detalle de la venta cargado:', data);
      },
      error: (err) => {
        console.error('Error al cargar la venta:', err);
        this.snackbar.error('❌ No se pudo cargar la venta');
      }
    });
  }
}
