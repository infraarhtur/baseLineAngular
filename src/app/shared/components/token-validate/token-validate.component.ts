import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-token-validate',
  standalone: false,
  templateUrl: './token-validate.component.html',
  styleUrl: './token-validate.component.scss'
})
export class TokenValidateComponent implements OnInit {

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
    });
    this.validateToken();
  }

  validateToken(): void {
    this.authService.validateToken(this.token).subscribe({
      next: (data) => {
        console.log(data);
        debugger;
        this.snackbarService.success(data.message);
        if (!data.valid) {
          setTimeout(() => {
            console.log('No es valido');
            //this.router.navigate(['/login']);
          }, 3000);
        }else{
          console.log('Es valido');
          //this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.log(error);
        this.snackbarService.error(error.error.message);
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          width: '450px',
          data: {
            message: `
            ${error.error.message}
          ` }
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      }
    });
  }
}
