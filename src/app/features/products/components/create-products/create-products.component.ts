import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';


@Component({
  selector: 'app-create-products',
  standalone: false,
  templateUrl: './create-products.component.html',
  styleUrl: './create-products.component.scss'
})
export class CreateProductsComponent {

  @Input() clientData?: any;
  @Output() formSubmitted = new EventEmitter<any>();



  constructor(private fb: FormBuilder,
    private snackbar: SnackbarService,
    private productsService: ProductsService, // Inyectamos el servicio
    private router: Router // Para redirigir después de guardar
  ) {}

  createProduct(formData: any): void {
    debugger;
    this.productsService.createProduct(formData).subscribe({
      next: () => {
        this.snackbar.success('✅ producto creado con éxito')
        this.router.navigate(['/products/select']);
      },
      error: (error) => {
        console.error('Error al crear cliente:', error);
        this.snackbar.error('❌ Ocurrió un error al crear el cliente.');
      }
    });
  }

}
