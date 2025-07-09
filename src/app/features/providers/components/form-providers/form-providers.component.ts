import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvidersService } from '../../../providers/services/providers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-providers',
  standalone: false,
  templateUrl: './form-providers.component.html',
  styleUrl: './form-providers.component.scss'
})
export class FormProvidersComponent implements OnInit, OnChanges {

  @Input() providerData?: any;
  @Output() formSubmitted = new EventEmitter<any>();

  providerForm!: FormGroup;
  constructor(private fb: FormBuilder,
      private providersService: ProvidersService,
      private router: Router
    ) {}

    ngOnInit(): void {
      this.buildForm();
    }
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['providerData'] && this.providerData) {
        this.buildForm();
      }

    }

    buildForm(): void {
      this.providerForm = this.fb.group({
        name: [this.providerData?.name || '', [Validators.required, Validators.maxLength(100)]],
        phone: [this.providerData?.phone || '', [Validators.required, Validators.pattern('^\\+?[0-9]{7,15}$')]],
        email: [this.providerData?.email || '', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]], // Mejor validación,
        address: [this.providerData?.address || '',[Validators.maxLength(60)]],

      });
    }

    onSubmit(): void {
      if (this.providerForm.valid) {
        this.formSubmitted.emit(this.providerForm.value);
      }
    }

    goBack(): void {
    this.router.navigate(['/providers/select']);
  }

}
