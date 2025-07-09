import { Component, EventEmitter, Input, OnInit, Output , OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  standalone: false,
})
export class ClientFormComponent implements OnInit,OnChanges {
  @Input() clientData?: any; // Datos para actualizar (opcional)
  @Output() formSubmitted = new EventEmitter<any>();

  clientForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router

  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientData'] && this.clientData) {
      this.buildForm();
    }
  }

  buildForm(): void {
    this.clientForm = this.fb.group({
      name: [this.clientData?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      phone: [this.clientData?.phone || '', [Validators.required, Validators.pattern('^\\+?[0-9]{7,15}$')]],
      email: [this.clientData?.email || '', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]], // Mejor validación,
      address: [this.clientData?.address || '',[Validators.maxLength(60)]],
      comment: [this.clientData?.comment || '',[Validators.maxLength(70)]]
    });
  }
  ngOnInit(): void {
    if (!this.clientForm) {
      this.buildForm(); // ✅ Construye el formulario vacío si no hay datos
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.formSubmitted.emit(this.clientForm.value);
    }
  }


  goBack(): void {
    this.router.navigate(['/clients/select']);
  }
}
