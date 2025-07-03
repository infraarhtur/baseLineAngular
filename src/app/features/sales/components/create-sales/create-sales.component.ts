import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';


@Component({
  selector: 'app-create-sales',
  standalone: false,
  templateUrl: './create-sales.component.html',
  styleUrl: './create-sales.component.scss'
})
export class CreateSalesComponent {
 @Input() saleData?: any;
 @Output() formSubmitted = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
    private snackbar: SnackbarService,
    private SalesService: SalesService, // Inyectamos el servicio
    private router: Router // Para redirigir después de guardar
  ) {}

  createSale(formData: any): void {
    this.SalesService.createSale(formData).subscribe({
      next: () => {
        this.snackbar.success('✅ Venta creada con éxito');
        this.router.navigate(['/sales/select']);
      },
      error: (error) => {
        console.error('Error al crear venta:', error);
        this.snackbar.error('❌ Ocurrió un error al crear la venta.');
      }
    });

  }


}
