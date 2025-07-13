

import { AfterViewInit, Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core'


@Component({
  selector: 'app-select-categories',
  standalone: false,
  templateUrl: './select-categories.component.html',
  styleUrl: './select-categories.component.scss'
})
export class SelectCategoriesComponent implements OnInit, OnChanges, AfterViewInit {
  displayedColumns: string[] = ['actions', 'name', 'description']; // ✅ Columnas de la tabla

  categories: any[] = []; // Lista de categorias
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator
  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {

    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log('Categorias cargadas:', this.dataSource.data);
        this.snackbar.success('Categorias cargadas');
      },
      error: (err) => {
        this.snackbar.error('Error al obtener categorias');
        console.error('Error al obtener categorias', err);
      }
    });
  }

  deleteCategory(id: string, name: string): void {
    console.log('Eliminar categoria con ID:', id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { message: `¿Estás seguro de que deseas eliminar la categoria \n ${name} ?  ` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriesService.deleteCategory(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(c => c.id !== id); // Actualiza la tabla
            this.snackbar.success('Categoria eliminada correctamente');
          },
          error: (err) => {
            this.snackbar.error('Error al eliminar la categoria');
            console.error('Error al eliminar la categoria', err);
          }
        });
      }
    });
  }

  updateCategory(id: number): void {
    // Método para actualizar una categoria
    console.log('actualizar providerp con ID:', id);
    this.router.navigate(['/category/update', id]);
    // Aquí puedes llamar a un servicio para eliminar el proveedores
  }

}
