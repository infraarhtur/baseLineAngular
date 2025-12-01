import { Component, EventEmitter, Input, OnInit, Output , OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdministrationService } from '../../service/administration.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-from-user',
  standalone: false,
  templateUrl: './from-user.component.html',
  styleUrl: './from-user.component.scss'
})
export class FromUserComponent  implements OnInit,OnChanges {
  @Input() userData?: any; // Datos para actualizar (opcional)
  @Output() formSubmitted = new EventEmitter<any>();

  userForm!: FormGroup;
  companyId: string = '';
  roles: any[] = [];
  constructor(private fb: FormBuilder,
              private router: Router,
              private adminService: AdministrationService,
              private authService: AuthService

  ) {}
  ngOnInit(): void {
    this.companyId = this.getPayload();
    this.getRoles();
    if (!this.userForm) {
      this.buildForm(); // ✅ Construye el formulario vacío si no hay datos
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      this.buildForm();
      // Si los roles ya están cargados, actualizar el valor del rol
      if (this.roles.length > 0) {
        this.userForm.patchValue({ role: this.userData.role });
      }
    }
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      name: [this.userData?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      email: [this.userData?.email || '', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]], // Mejor validación,
      password: ['Inventario.123'],
      role: [this.userData?.role || '', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      company_id: [this.companyId || '']
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.formSubmitted.emit(this.userForm.value);
    }
  }

  goBack(): void {
    this.router.navigate(['/administration/select-user']);
  }

  getRoles() {
    this.adminService.getRoles().subscribe({
      next: (data) => {
             this.roles = data.roles || [];
             // Si hay userData y el formulario ya existe, actualizar el valor del rol
             if (this.userData && this.userForm) {
               this.userForm.patchValue({ role: this.userData.roles[0] });
             }
      },
      error: (error) => {
        console.error('Error al obtener roles:', error);
        this.roles = [];
      }
    });
  }
  getPayload() {
    const payload = this.authService.getTokenPayload();
    if (payload && payload.company_id) {
      this.companyId = payload.company_id;
    } else {
      console.error('Payload inválido o sin company_id:', payload);
      this.companyId = '';
    }
    return this.companyId;
  }
}
