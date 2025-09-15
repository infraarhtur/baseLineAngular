import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-email-validate',
  standalone: false,
  templateUrl: './email-validate.component.html',
  styleUrl: './email-validate.component.scss'
})
export class EmailValidateComponent  implements OnInit {

  token: string = '';

  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog) {}

  ngOnInit(): void {
     // Obtener el token del parámetro de la URL
    this.route.params.subscribe(params => {
      this.token = params['token'] || '';
      console.log('Token recibido:', this.token);
      // Validar el token solo si se recibió uno
      if (this.token) {
        this.validateToken();
      } else {
        console.error('No se recibió token en la URL');
        this.router.navigate(['/login']);
      }
    });
  }

  validateToken(): void {
    this.authService.emailVerifiedConfirm(this.token).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
        this.snackbarService.error(error.error.message);
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          width: '450px',
          data: {
            message: `
            El token no es valido.
          ` }
        });
      }
    });
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }
}
