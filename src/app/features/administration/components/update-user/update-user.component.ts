import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../../service/administration.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Router , ActivatedRoute} from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-update-user',
  standalone: false,
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent implements OnInit {
  userId!: string; // ✅ Aquí se almacena el ID recibido
  userdata: any;
  constructor(private fb: FormBuilder,
    private snackbar: SnackbarService,
    private adminService: AdministrationService, // Inyectamos el servicio
    private router: Router, // Para redirigir después de guardar
    private authService: AuthService ,// Inyectamos el servicio
    private route: ActivatedRoute,

    ) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = String(params.get('id'));
      this.loadUser();
    });
  }

  updateUser(formData: any): void {

    this.adminService.updateUser(this.userId ,formData).subscribe({
      next: () => {
        this.snackbar.success('Usuario actualizado con éxito');
        this.router.navigate(['/administration/select-user']);
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.snackbar.error('❌ No se pudo actualizar el usuario');
      }
    });
  }

  loadUser(): void {
    this.adminService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.userdata = data;
        this.snackbar.success('Usuario cargado con éxito');
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.snackbar.error('❌ No se pudo cargar el usuario');
      }
    });
  }
}
