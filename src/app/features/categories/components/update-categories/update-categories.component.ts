import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-update-categories',
  standalone: false,
  templateUrl: './update-categories.component.html',
  styleUrl: './update-categories.component.scss'
})
export class UpdateCategoriesComponent  implements OnInit{
    categoryId!: string; // ✅ Aquí se almacena el ID recibido
    categoryData: any;
    constructor(
      private route: ActivatedRoute,
      private snackbar: SnackbarService,
      private categoriesService: CategoriesService, // Inyectamos el servicio
      private router: Router // Para redirigir después de guardar
    ) {}

      ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = String(params.get('id')); // ✅ Obtener el ID de la URL
      console.log('proveedor a actualizar:', this.categoryId);
      this.loadCategory();
    });
  }

    loadCategory(): void {
    this.categoriesService.getCategoryById(this.categoryId).subscribe({
      next: (data) => {
        this.categoryData = data;
        console.log('proveedor adaptado para el formulario:', this.categoryData);
      },
      error: (err) => {
        console.error('Error al cargar proveedor:', err);
        this.snackbar.error('❌ No se pudo cargar el proveedor');
      }
    });
  }
  updateCategory(data: any): void {
    this.categoriesService.updateCategory(this.categoryId, data).subscribe({
      next: () => {
        this.snackbar.success('✅ proveedor actualizado con éxito');
        this.router.navigate(['/category/select']);
      },
      error: (err) => {
        console.error('Error al actualizar proveedor:', err);
        this.snackbar.error('❌ Ocurrió un error al actualizar el proveedor');
      }
    });
  }


}
