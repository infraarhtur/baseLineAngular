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
  selectedProducts: any[] = [];
  totalAmount: number = 0;


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
  ) { }


  ngOnInit(): void {
    // this.loadProviders();
    // this.loadCategories();
     this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['saleData'] && this.saleData) {
      this.buildForm();
    }
  }

buildForm(): void {
  this.saleForm = this.fb.group({
    client_id: [this.saleData?.client_id || null, Validators.required],
    sale_date: [this.saleData?.sale_date || new Date(), Validators.required],
    payment_method: [this.saleData?.payment_method || 'cash', Validators.required],
    comment: [this.saleData?.comment || new Date()],
    status: [this.saleData?.status || 'pending', Validators.required],
  });
}

handleSelectedProducts(products: any[]): void {
  this.selectedProducts = products;
  console.log('Productos recibidos en el padre:', this.selectedProducts);
    // ✅ Calcular el total sumando los campos `total` de cada producto
  this.totalAmount = products.reduce((acc, p) => acc + (p.total || 0), 0);
}

onClientSelected(client: any): void {
  console.log('Cliente recibido en FormSalesComponent:', client);
  this.saleForm.patchValue({ client_id: client.id });
}


onSubmit(): void {
  debugger;
  if (this.saleForm.valid) {
    console.log('Formulario enviado con:', this.saleForm.value);
    this.formSubmitted.emit(this.saleForm.value);
  } else {
    this.saleForm.markAllAsTouched();
    this.snackbar.error('Por favor completa todos los campos obligatorios');
  }
}

}
