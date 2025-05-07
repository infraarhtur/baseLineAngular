import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvidersService } from '../../../providers/services/providers.service';

@Component({
  selector: 'app-form-products',
  standalone: false,
  templateUrl: './form-products.component.html',
  styleUrl: './form-products.component.scss'
})
export class FormProductsComponent implements OnInit {

  @Input() productData?: any;
  @Output() formSubmitted = new EventEmitter<any>();

  productForm!: FormGroup;
  providers: any[] = [];
  constructor(private fb: FormBuilder, private providersService: ProvidersService) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadProviders();
  }


  buildForm(): void {
    this.productForm = this.fb.group({
      name: [this.productData?.name || '', [Validators.required, Validators.maxLength(100)]],
      description: [this.productData?.description || '', [Validators.maxLength(255)]],
      sale_price: [this.productData?.sale_price || 0, [Validators.required, Validators.min(0)]],
      purchase_price: [this.productData?.purchase_price || 0, [Validators.required, Validators.min(0)]],
      stock: [this.productData?.stock || 0, [Validators.required, Validators.min(0)]],
      provider_id: [this.productData?.provider_id || '', Validators.required]
    });
  }

  loadProviders(): void {
    this.providersService.getAllProviders().subscribe({
      next: (data) => (this.providers = data),
      error: (err) => console.error('Error al cargar proveedores:', err)
    });
  }
  onSubmit(): void {
    if (this.productForm.valid) {
      this.formSubmitted.emit(this.productForm.value);
    } else {
      this.productForm.markAllAsTouched();
    }
  }

}
