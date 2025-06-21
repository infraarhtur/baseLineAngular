import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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

  displayedColumns: string[] = ['product_name', 'quantity', 'subtotal', 'discount', 'total']; // ✅ Columnas de la tabla

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() formSubmitted = new EventEmitter<any>();


  @Input() isUpdate?: boolean = false;
  saleForm!: FormGroup;
  saleId!: string; // ✅ Aquí se almacena el ID recibido
  providerData: any;
  constructor(
    private fb: FormBuilder,
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
      this.buildForm();


    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadData(this.saleData);
  }

  // ✅ Validador personalizado embebido
  private minArrayLengthValidator(minLength: number = 1) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return Array.isArray(value) && value.length >= minLength
        ? null
        : { minArrayLength: true };
    };
  }

  loadSale(): void {
    this.salesService.getSaletById(this.saleId).subscribe({
      next: (data) => {
        this.saleData = data;
        this.dataSource.data = this.saleData.details; // Asignar los detalles de la venta a la fuente de datos
        console.log('Detalle de la venta cargado:', data);
      },
      error: (err) => {
        console.error('Error al cargar la venta:', err);
        this.snackbar.error('❌ No se pudo cargar la venta');
      }
    });
  }

  buildForm(): void {
    this.saleForm = this.fb.group({
      payment_method: [this.saleData?.payment_method || '', Validators.required],
      comment: [this.saleData?.comment || '', Validators.maxLength(400)],
      status: [this.saleData?.status || '', Validators.required],

    });
  }
  loadData(data: any): void {

    switch (data.payment_method) {
      case 'cash':
        this.saleForm.patchValue({ payment_method: 'cash' });
        break;
      case 'tarjeta de crédito':
        this.saleForm.patchValue({ payment_method: 'credit_card' });
        break;
      case 'Transferencia':
        this.saleForm.patchValue({ payment_method: 'bank_transfer' });
        break;
      default:
        this.saleForm.patchValue({ payment_method: 'other' });
    }

    this.saleForm.patchValue({ comment: data.comment || '' });
    // this.saleForm.patchValue({ status: data.status || '' });
    console.log('Estado de la venta:', data.status);
    switch (data.status) {
      case 'pending':
        this.saleForm.patchValue({ status: 'pending' });
        break;
      case 'paid':
        this.saleForm.patchValue({ status: 'paid' });
        break;
      case 'canceled':
        this.saleForm.patchValue({ status: 'canceled' });
        break;
      default:
        this.saleForm.patchValue({ status: 'Pendiente' });
    }

  }

  onSubmit(): void {
    let sendData = {
      ...this.saleForm.value,
      sale_id: this.saleId // Agregar el ID de la venta al enviar
    };

    if (this.saleForm.valid){
      this.formSubmitted.emit(sendData);
    } else {
      this.saleForm.markAllAsTouched();
      this.snackbar.error('Por favor completa todos los campos obligatorios');
    }
  }
  cancelUpdate(): void {
    this.router.navigate(['/sales/select']);
    this.snackbar.info('Edición cancelada');
  }

  backToSales(): void {
    this.router.navigate(['/sales/select']);
    this.snackbar.info('Volviendo a la lista de ventas');
  }
}
