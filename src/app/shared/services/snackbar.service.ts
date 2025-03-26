import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  private show(message: string, panelClass: string) {
    const config: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    };
    this.snackBar.open(message, 'Cerrar', config);
  }

  success(message: string) {
    this.show(message, 'snackbar-success');
  }

  error(message: string) {
    this.show(message, 'snackbar-error');
  }

  info(message: string) {
    this.show(message, 'snackbar-info');
  }

  warning(message: string) {
    this.show(message, 'snackbar-warning');
  }

}
