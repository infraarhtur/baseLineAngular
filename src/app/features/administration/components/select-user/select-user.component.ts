import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AdministrationService } from '../../service/administration.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-select-user',
  standalone: false,
  templateUrl: './select-user.component.html',
  styleUrl: './select-user.component.scss'
})
export class SelectUserComponent implements OnInit, AfterViewInit {
  users: any[] = [];
  selectedUserId: string | null = null;
  companyId: string = '';
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [ 'actions','user_name', 'user_email','roles','is_active','is_verified','joined_at'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private administrationService: AdministrationService,
    private router: Router,
    private authService: AuthService,
     private snackBar: SnackbarService,
     private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getPayload();
    if (this.companyId) {
      this.getUsersByCompany();
    } else {
      console.error('No se pudo obtener el companyId del token');
      this.snackBar.error('Error: No se pudo obtener la información de la empresa');
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getPayload() {
    const payload = this.authService.getTokenPayload();
    console.log('payload:', payload);
    if (payload && payload.company_id) {
      this.companyId = payload.company_id;
    } else {
      console.error('Payload inválido o sin company_id:', payload);
      this.companyId = '';
    }
    return this.companyId;
  }

  getUsersByCompany() {
    console.log('Obteniendo usuarios para companyId:', this.companyId);
    this.administrationService.getUsersByCompany(this.companyId).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data.users);
        this.users = data.users;
        this.dataSource.data = data.users;
        console.log('Usuarios asignados:', this.users);
        this.snackBar.success('Usuarios cargados');
      },
      error: (err) => {
        this.snackBar.error('Error al obtener usuarios');
        console.error('Error al obtener usuarios', err);
      }
    });
  }

  desactivateUser(id: string, name: string, email: string): void {
    console.log('Eliminar usuario con ID:', id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { message: `¿Estás seguro de que deseas desactivar el usuario \n ${name} con email ${email}?  ` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.administrationService.deleteUser(id).subscribe({
          next: () => {
            console.log('Usuario eliminado:', id);
            this.snackBar.success('Usuario eliminado correctamente');
            this.getUsersByCompany();
          },
          error: (err) => {
            console.error('Error al eliminar el usuario', err);
            this.snackBar.error('Error al eliminar el usuario');
          }
        });

      }
    });
  }

  activateUser(id: string, name: string, email: string): void {
    console.log('Activar usuario con ID:', id);
    this.administrationService.activateUser(id).subscribe({
      next: () => {
        console.log('Usuario activado:', id);
        this.snackBar.success('Usuario activado correctamente');
        this.getUsersByCompany();
      },
      error: (err) => {
        console.error('Error al activar el usuario', err);
        this.snackBar.error('Error al activar el usuario');
      }
    });
  }


  updateUser(id: string): void {
    console.log('Actualizar usuario con ID:', id);
    this.router.navigate(['/administration/update-user', id]);
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  validateEmail(email: string): void {
    this.authService.emailVerified(email).subscribe({
      next: () => {
        console.log('Email enviado con éxito');
        this.snackBar.success('✅  se envio el email de verificación')
      }
    });
  }


}
