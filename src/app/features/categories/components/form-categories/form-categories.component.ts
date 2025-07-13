import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-form-categories',
  standalone: false,
  templateUrl: './form-categories.component.html',
  styleUrl: './form-categories.component.scss'
})
export class FormCategoriesComponent implements OnInit, OnChanges {
  @Input() categoryData?: any;
  @Output() formSubmitted = new EventEmitter<any>();

  categoryForm!: FormGroup;
  constructor(private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.buildForm();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryData'] && this.categoryData) {
      this.buildForm();
    }
  }

  buildForm(): void {

    this.categoryForm = this.fb.group({
      name: [this.categoryData?.name || '', [Validators.required, Validators.maxLength(100)]],
      description: [this.categoryData?.description || '', [Validators.maxLength(120)]],

    });
  }
  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.formSubmitted.emit(this.categoryForm.value);
    }
  }

  goBack(): void {
    this.router.navigate(['/category/select']);
  }

}




