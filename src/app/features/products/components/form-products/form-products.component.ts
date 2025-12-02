import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ProvidersService } from '../../../providers/services/providers.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-products',
  standalone: false,
  templateUrl: './form-products.component.html',
  styleUrl: './form-products.component.scss'
})
export class FormProductsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() productData?: any;
  @Output() formSubmitted = new EventEmitter<any>();

  productForm!: FormGroup;
  providers: any[] = [];
  categories: any[] = [];
  private subscriptions: Subscription[] = [];

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
    // Limpiar suscripciones anteriores si existen
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    this.productForm = this.fb.group({
      name: [this.productData?.name || '', [Validators.required, Validators.maxLength(100)]],
      description: [this.productData?.description || '', [Validators.maxLength(255)]],
      sale_price: [this.productData?.sale_price || 0, [Validators.required, Validators.min(0)]],
      purchase_price: [this.productData?.purchase_price || 0, [Validators.required, Validators.min(0)]],
      stock: [this.productData?.stock || 0, [Validators.required, Validators.min(0)]],
      providers_ids: [this.productData?.providers_ids?.map((c: any) => c.id) || [], Validators.required],
      category_ids: [this.productData?.categories_ids?.map((c: any) => c.id) || [], Validators.required]
    }, { validators: this.priceComparisonValidator });

    // Suscribirse a cambios en los precios para validar en tiempo real
    const purchasePriceSub = this.productForm.get('purchase_price')?.valueChanges.subscribe(() => {
      this.productForm.updateValueAndValidity({ emitEvent: false });
    });
    const salePriceSub = this.productForm.get('sale_price')?.valueChanges.subscribe(() => {
      this.productForm.updateValueAndValidity({ emitEvent: false });
    });
    
    if (purchasePriceSub) this.subscriptions.push(purchasePriceSub);
    if (salePriceSub) this.subscriptions.push(salePriceSub);
  }

  priceComparisonValidator(formGroup: AbstractControl) {
    const purchasePrice = formGroup.get('purchase_price')?.value;
    const salePrice = formGroup.get('sale_price')?.value;
    
    // Solo validar si ambos valores existen y son números válidos
    if (purchasePrice != null && purchasePrice !== '' && salePrice != null && salePrice !== '' && 
        !isNaN(Number(purchasePrice)) && !isNaN(Number(salePrice))) {
      const purchaseNum = Number(purchasePrice);
      const saleNum = Number(salePrice);
      
      if (purchaseNum > saleNum) {
        formGroup.get('purchase_price')?.setErrors({ greaterThanSalePrice: true });
        return { purchasePriceGreaterThanSalePrice: true };
      }
    }
    
    // Limpiar el error si la validación pasa
    const purchasePriceControl = formGroup.get('purchase_price');
    if (purchasePriceControl?.hasError('greaterThanSalePrice')) {
      const errors = { ...purchasePriceControl.errors };
      delete errors['greaterThanSalePrice'];
      purchasePriceControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
    
    return null;
  }

  onPriceFieldFocus(fieldName: 'purchase_price' | 'sale_price'): void {
    const control = this.productForm.get(fieldName);
    if (control && (control.value === 0 || control.value === '0' || control.value === null)) {
      control.setValue('');
    }
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
