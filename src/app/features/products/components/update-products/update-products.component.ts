import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-update-products',
  standalone: false,
  templateUrl: './update-products.component.html',
  styleUrl: './update-products.component.scss'
})
export class UpdateProductsComponent implements OnInit {
  productId!: string; // ✅ Aquí se almacena el ID recibido
  @Input() productData?: any;
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private productsService: ProductsService, // Inyectamos el servicio
    private router: Router // Para redirigir después de guardar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = String(params.get('id')); // ✅ Obtener el ID de la URL
      console.log('producto a actualizar:', this.productId);
      this.loadProduct();
    });
  }

  loadProduct():void{
    this.productsService.getProductById(this.productId).subscribe({
      next: (data) => {
        this.productData = data;
        console.log('producto adaptado para el formulario:', this.productData);
      },
      error: (err) => {
        console.error('Error al cargar el producto:', err);
        this.snackbar.error('❌ No se pudo cargar el producto');
      }
    });
  }

  updateProduct(data: any): void {
    this.productsService.updateProduct(this.productId, data).subscribe({
    next: () => {
      this.snackbar.success('✅ producto creado con éxito')
      this.router.navigate(['/products/select']);
    },
    error: (error) => {
      console.error('Error al crear producto:', error);
      this.snackbar.error('❌ Ocurrió un error al actualizar el producto.');
    }
  });
}


}
