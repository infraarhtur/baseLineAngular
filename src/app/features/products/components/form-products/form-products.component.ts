import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvidersService } from '../../../providers/services/providers.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-products',
  standalone: false,
  templateUrl: './form-products.component.html',
  styleUrl: './form-products.component.scss'
})
export class FormProductsComponent implements OnInit, OnChanges {

  @Input() productData?: any;
  @Output() formSubmitted = new EventEmitter<any>();

  productForm!: FormGroup;
  providers: any[] = [];
  categories: any[] = [];

  constructor(private fb: FormBuilder,
     private providersService: ProvidersService,
     private categoriesService: CategoriesService,
     private router: Router
    ) {}

  ngOnInit(): void {
    this.loadProviders();
    this.loadCategories();
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productData'] && this.productData) {
      this.buildForm();
    }
  }

  buildForm(): void {
    this.productForm = this.fb.group({
      name: [this.productData?.name || '', [Validators.required, Validators.maxLength(100)]],
      description: [this.productData?.description || '', [Validators.maxLength(255)]],
      sale_price: [this.productData?.sale_price || 0, [Validators.required, Validators.min(0)]],
      purchase_price: [this.productData?.purchase_price || 0, [Validators.required, Validators.min(0)]],
      stock: [this.productData?.stock || 0, [Validators.required, Validators.min(0)]],
      providers_ids: [this.productData?.providers_ids?.map((c: any) => c.id) || [], Validators.required],
      category_ids: [this.productData?.categories_ids?.map((c: any) => c.id) || [], Validators.required]
    });
  }

  loadProviders(): void {
    this.providersService.getAllProviders().subscribe({
      next: (data) => (this.providers = data),
      error: (err) => console.error('Error al cargar proveedores:', err)
    });
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (data) => this.categories = Array.isArray(data) ? data : [],
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.formSubmitted.emit(this.productForm.value);
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.router.navigate(['/products/select']);
  }

}
