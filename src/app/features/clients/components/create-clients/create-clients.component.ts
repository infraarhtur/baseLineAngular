
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-create-clients',
  standalone: false,
  templateUrl: './create-clients.component.html',
  styleUrl: './create-clients.component.scss'
})
export class CreateClientsComponent {
  clientForm: FormGroup;
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
    private clientsService: ClientsService, // Inyectamos el servicio
    private router: Router // Para redirigir después de guardar
    ) {
    this.clientForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      telefono: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{7,15}$')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]], // Mejor validación,
      direccion: ['',[Validators.maxLength(60)]],
      comentario: ['',[Validators.maxLength(70)]]
    });
  }

  onSubmit() {
    debugger;
    if (this.clientForm.valid) {
      this.formSubmitted.emit(this.clientForm.value);
      console.log('Formulario enviado:', this.clientForm.value);
    }
  }

}
