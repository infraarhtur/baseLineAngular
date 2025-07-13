import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-create-categories',
  standalone: false,
  templateUrl: './create-categories.component.html',
  styleUrl: './create-categories.component.scss'
})
export class CreateCategoriesComponent {
    @Input() categoryData?: any;
    @Output() formSubmitted = new EventEmitter<any>();
    constructor(private fb: FormBuilder,
      private snackbar: SnackbarService,
      private categoriesService: CategoriesService, // Inyectamos el servicio
      private router: Router // Para redirigir después de guardar
    ) { }
    createCategory(formData: any): void {
    this.categoriesService.createCategory(formData).subscribe({
      next: () => {
        this.snackbar.success('✅ Provider creado con éxito')
        this.router.navigate(['/category/select']);
      },
      error: (error) => {
        console.error('Error al crear provider:', error);
        this.snackbar.error('❌ Ocurrió un error al crear el provider.');
      }
    });

}

}
