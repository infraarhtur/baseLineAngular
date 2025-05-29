import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvidersService } from '../../../providers/services/providers.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { SalesService } from '../../services/sales.service';
import { ProductsService } from '../../../products/services/products.service';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from '../../../../shared/services/snackbar.service';


@Component({
  selector: 'app-form-sales',
  standalone: false,
  templateUrl: './form-sales.component.html',
  styleUrl: './form-sales.component.scss'
})
export class FormSalesComponent {


  @Input() saleData?: any;
  @Output() formSubmitted = new EventEmitter<any>();



  saleForm!: FormGroup;
  providers: any[] = [];
  categories: any[] = [];
  products: any[] = [];

  constructor(private fb: FormBuilder,
     private productsService: ProductsService,
     private providersService: ProvidersService,
     private categoriesService: CategoriesService,
     private salesService: SalesService,
     private snackbar: SnackbarService,
    ) {}


  ngOnInit(): void {
    // this.loadProviders();
    // this.loadCategories();
    // this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productData'] && this.saleData) {
      this.buildForm();
    }
  }

  buildForm(): void {
    this.saleForm = this.fb.group({});
  //   this.productForm = this.fb.group({
  //     name: [this.productData?.name || '', [Validators.required, Validators.maxLength(100)]],
  //     description: [this.productData?.description || '', [Validators.maxLength(255)]],
  //     sale_price: [this.productData?.sale_price || 0, [Validators.required, Validators.min(0)]],
  //     purchase_price: [this.productData?.purchase_price || 0, [Validators.required, Validators.min(0)]],
  //     stock: [this.productData?.stock || 0, [Validators.required, Validators.min(0)]],
  //     providers_ids: [this.productData?.providers_ids?.map((c: any) => c.id) || [], Validators.required],
  //     category_ids: [this.productData?.categories_ids?.map((c: any) => c.id) || [], Validators.required]
  //   });
  }


  onSubmit(): void {
    if (this.saleForm.valid) {
      this.formSubmitted.emit(this.saleForm.value);
    } else {
      this.saleForm.markAllAsTouched();
    }
  }
}
