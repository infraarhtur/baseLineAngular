import { AfterViewInit, Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core'


@Component({
  selector: 'app-select-products',
  standalone: false,
  templateUrl: './select-products.component.html',
  styleUrl: './select-products.component.scss'
})
export class SelectProductsComponent implements OnInit, OnChanges, AfterViewInit {

  allColumns = {
    select: 'select',
    name: 'name',
    description: 'description',
    sale_price: 'sale_price',
    purchase_price: 'purchase_price',
    provider: 'provider',
    categories: 'categories',
    quantity: 'quantity',
    discount: 'discount',
    total: 'total',
    actions: 'actions'
  };


  displayedColumns: string[] = []; // ✅ Columnas de la tabla

  products: any[] = []; // Lista de productos
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();
  @Input() isSelected?: boolean = false;
  @Output() selectedProductsChange = new EventEmitter<any[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator
  constructor(
    private productsService: ProductsService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.setDisplayedColumns()
  }

  ngOnInit(): void {
    this.setDisplayedColumns()
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.snackbar.success('Productos cargados');
      },
      error: (err) => {
        this.snackbar.error('Error al obtener productos');
        console.error('Error al obtener productos', err);
      }
    });
  }

  deleteProduct(id: string, name: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { message: `¿Estás seguro de que deseas eliminar el producto \n ${name} ?  ` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productsService.deleteProduct(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(c => c.id !== id); // Actualiza la tabla
            console.log('Producto eliminado correctamente');
            this.snackbar.success('Producto eliminado correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar el producto', err);
            this.snackbar.error('Error al eliminar el producto');
          }
        });
      }
    });
    // Aquí puedes llamar a un servicio para eliminar el producto
  }

  updateProduct(id: number): void {
    console.log('actualizar productp con ID:', id);
    this.router.navigate(['/products/update', id]);
    // Aquí puedes llamar a un servicio para eliminar el producto
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
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(event: any) {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }

    const productosSeleccionados = this.selection.selected;
    // 🚨 Emitimos los productos seleccionados
    this.selectedProductsChange.emit(this.selection.selected);

  }

  viewSelection(): void {
    const productosSeleccionados = this.selection.selected;

    if (productosSeleccionados.length === 0) {
      this.snackbar.error('❌ Debes seleccionar al menos un producto');
      return;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setDisplayedColumns(): void {
    const baseColumns = [
      this.allColumns.name,
      this.allColumns.description,
      this.allColumns.sale_price,
      this.allColumns.provider,
      this.allColumns.categories
    ];

    if (this.isSelected) {
      this.displayedColumns = [
        this.allColumns.select,
        ...baseColumns,
        this.allColumns.quantity,
        this.allColumns.discount,
        this.allColumns.total
      ];
    } else {
      baseColumns.splice(2, 0, this.allColumns.purchase_price); // Insertar después de sale_price
      this.displayedColumns = [...baseColumns, this.allColumns.actions];
    }
  }

  updateTotal(product: any): void {
    const quantity = Number(product.quantity) || 0;
    const discount = Number(product.discount) || 0;

    const unitPrice = Number(product.sale_price) || 0;
    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount

    // Guarda el total redondeado a 2 decimales
    product.total = parseFloat(total.toFixed(2));
  }

  toggleSelection(product: any, checked: boolean): void {
    if (checked) {
      this.selection.select(product);
      product.quantity = product.quantity ?? 1;
      product.discount = product.discount ?? 0;
      product.tax = product.tax ?? 0;
      this.updateTotal(product);
    } else {
      this.selection.deselect(product);
      product.quantity = null;
      product.discount = null;
      product.tax = null;
      product.total = null;
    }

    // 🚨 Emitimos los productos seleccionados
    this.selectedProductsChange.emit(this.selection.selected);
  }
  getTotalAmount(): number {
    return this.selection.selected.reduce((sum, item) => sum + (item.total || 0), 0);
  }
}
