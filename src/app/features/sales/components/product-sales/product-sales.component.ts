import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvidersService } from '../../../providers/services/providers.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { SalesService } from '../../services/sales.service';
import { ProductsService } from '../../../products/services/products.service';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-product-sales',
  standalone: false,
  templateUrl: './product-sales.component.html',
  styleUrl: './product-sales.component.scss'
})


export class ProductSalesComponent {
     displayedColumns: string[] = [ 'select',
    'name',
    'description',
    'sale_price',
    'purchase_price',
    'provider',
    'categories'
  ]; // ✅ Columnas de la tabla


  products: any[] = [];
  selection = new SelectionModel<any>(true, []);
  dataSourceProducts = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator



  constructor(private fb: FormBuilder,
    private productsService: ProductsService,
    private providersService: ProvidersService,
    private categoriesService: CategoriesService,
    private salesService: SalesService,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.dataSourceProducts.paginator = this.paginator;
  }

  loadProducts(): void {
  this.productsService.getProducts().subscribe({
    next: (data) => {
      this.dataSourceProducts.data = data;
      console.log('Productos cargados:', this.dataSourceProducts.data );
      this.snackbar.success('Productos cargados');
          },
    error: (err) => {
      this.snackbar.error('Error al obtener productos');
      console.error('Error al obtener productos', err);
    }
  });
  }

getCategoryNames(product: any): string {
    return product.categories?.length
      ? product.categories.map((c: any) => c.name).join(', ')
      : '';
  }

getProvidersNames(product: any): string {
    return product.providers?.length
       ? product.providers.map((c: any) => c.name).join(', ')
       : '';
   }

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSourceProducts.data.length;
  return numSelected === numRows;
}

toggleAllRows(event: any) {
  if (this.isAllSelected()) {
    this.selection.clear();
  } else {
    this.dataSourceProducts.data.forEach(row => this.selection.select(row));
  }

  const productosSeleccionados = this.selection.selected;
  console.log('Productos seleccionados:', productosSeleccionados);

}

viewSelection():void{
  const productosSeleccionados = this.selection.selected;

  if (productosSeleccionados.length === 0) {
    this.snackbar.error('❌ Debes seleccionar al menos un producto');
    return;
  }

  console.log('Productos seleccionados:', productosSeleccionados);
}

}
