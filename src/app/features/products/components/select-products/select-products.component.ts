import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class SelectProductsComponent implements OnInit, AfterViewInit  {
  displayedColumns: string[] = [ 'name','description', 'sale_price','purchase_price','provider','categories', 'actions']; // ✅ Columnas de la tabla

  products: any[] = []; // Lista de productos
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator
  constructor(
    private productsService: ProductsService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
  ) {}


  ngOnInit(): void {
    this.loadProducts();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log('Productos cargados:', this.dataSource.data );
        this.snackbar.success('Productos cargados');
            },
      error: (err) => {
        this.snackbar.error('Error al obtener productos');
        console.error('Error al obtener productos', err);
      }
    });
  }

  deleteProduct(id: string,name:string): void {
    console.log('Eliminar producto con ID:', id);
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


}
