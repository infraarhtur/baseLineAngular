import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProvidersService } from '../../../providers/services/providers.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { SalesService } from '../../services/sales.service';
import { ProductsService } from '../../../products/services/products.service';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  totalDiscount: number = 0; // Para almacenar el total de descuento de la venta


  saleForm!: FormGroup;
  providers: any[] = [];
  categories: any[] = [];
  products: any[] = [];
  totals: number[] = []; // Para almacenar los totales de cada producto
  totalsDiscount: number[] = []; // Para almacenar los totales de descuento de cada producto

  constructor(private fb: FormBuilder,
    private productsService: ProductsService,
    private providersService: ProvidersService,
    private categoriesService: CategoriesService,
    private salesService: SalesService,
    private snackbar: SnackbarService,
    private router: Router // Para redirigir después de guardar
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

    // ✅ Validador personalizado embebido
  private minArrayLengthValidator(minLength: number = 1) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return Array.isArray(value) && value.length >= minLength
        ? null
        : { minArrayLength: true };
    };
  }

  buildForm(): void {
    this.saleForm = this.fb.group({
      client_id: [this.saleData?.client_id || null, Validators.required],
      sale_date: [this.saleData?.sale_date || new Date(), Validators.required],
      payment_method: [this.saleData?.payment_method || 'cash', Validators.required],
      comment: [this.saleData?.comment || '', Validators.maxLength(400)],
      status: [this.saleData?.status || 'pending', Validators.required],
      details: this.fb.array([], this.minArrayLengthValidator(1)),
      client: this.fb.group({}),
      total_amount: [{ value: 0 }],
      total_discount: [{ value: 0 }],
    });
  }

  handleSelectedProducts(products: any[]): void {
    this.selectedProducts = products;
    // ✅ Calcular el total sumando los campos `total` de cada producto
    this.totalAmount = products.reduce((acc, p) => acc + (p.total || 0), 0);
  }

  onClientSelected(client: any): void {
    console.log('Cliente seleccionado desde el hijo:', client);
    // this.clientSelected.emit(client);
    this.saleForm.patchValue({ client_id: client.id });

    this.saleForm.setControl('client', this.fb.group({
      id: [client.id, Validators.required],
      name: [client.name, Validators.required],
      email: [client.email, [Validators.required, Validators.email]],
      phone: [client.phone, Validators.required],
      address: [client.address],
      comment: [client.comment],
    }));
  }

  loadDetails(): void {
    const detailsArray = this.saleForm.get('details') as FormArray;
    // const clientSelected = this.saleForm.get('details') as FormArray;
    detailsArray.clear(); // Evita duplicados
    // Limpiar el FormArray antes de agregar nuevos productos
    this.totals = [];
    this.totalsDiscount = []; // Limpiar el array de totales de descuento
    this.selectedProducts.forEach(product => {
      const quantity = product.quantity || 1;
      const salePrice = product.sale_price || 0;
      const discount = product.discount || 0;
      const tax = product.tax || 0;
      const subtotal = quantity * salePrice;
      const discountAmount = subtotal * (discount / 100);
      const taxedAmount = (subtotal - discountAmount) * (tax / 100);
      const total = subtotal - discountAmount + taxedAmount;
      this.totals.push(total); // Agregar el total del producto al array de totales
      this.totalsDiscount.push(discountAmount); // Agregar el descuento del producto al array de totales de descuento

      detailsArray.push(this.fb.group({
        product_id: [product.id, Validators.required],
        sale_price: [salePrice, [Validators.required, Validators.min(0)]],
        tax: [tax, [Validators.required, Validators.min(0)]],
        subtotal: [parseFloat(subtotal.toFixed(2)), [Validators.required, Validators.min(0)]],
        quantity: [quantity, [Validators.required, Validators.min(1)]],
        discount: [discount, [Validators.required, Validators.min(0)]],
        total: [parseFloat(total.toFixed(2)), Validators.required]
      }));
    });
    // Actualizar el total de la venta
    this.totalAmount = this.totals.reduce((acc, total) => acc + total, 0);
    this.saleForm.get('total_amount')?.setValue(this.totalAmount);
    this.totalDiscount = this.totalsDiscount.reduce((acc, total) => acc + total, 0);
    console.log('Total de descuento:', this.totalDiscount);
    this.saleForm.get('total_discount')?.setValue(this.totalDiscount); // Actualizar el total de descuento en el formulario
   }

  onSubmit(): void {
    this.loadDetails();
    console.log('Datos del formulario:', this.saleForm.value);

    if (this.saleForm.valid) {
      console.log('Formulario enviado con:', this.saleForm.value);
      this.formSubmitted.emit(this.saleForm.value);
    } else {
      this.saleForm.markAllAsTouched();
      this.snackbar.error('Por favor completa todos los campos obligatorios');
    }
  }
  goBack(): void {
    this.router.navigate(['/sales/select']);
  }


}
