import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdministrationService } from '../../service/administration.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RoleCheckBoxComponent } from '../role-check-box/role-check-box.component';
import { CreateRoleComponent } from '../create-role/create-role.component';
import { AuthService } from '../../../../services/auth.service';



export interface Permission {
  id: string;
  name: string;
  category: string;
  isCategory: boolean;
}

export interface RolePermission {
  role: string;
  permissions: { [permissionId: string]: boolean };
}

export interface Permission { id: string; name: string; }
export interface Role { id: string; name: string; company_id: string; permissions: Permission[]; }



// ===== Tipos de ENTRADA (tal como llegan del backend) =====
interface InPermission { id: string; name: string; } // p.ej. "user:read"
interface InRole {
  id: string;
  name: string;
  company_id: string;
  permissions: InPermission[];
}

// ===== Tipos de SALIDA (lo que usaremos en la vista) =====
interface OutPermission { id: string; name: string; }                  // acción (read/create/...)
interface OutCategory { name: string; permissions: OutPermission[]; }  // name = categoría (user/company/...)
interface OutRole {
  id: string;
  name: string;
  company_id: string;
  categories: OutCategory[];
}
@Component({
  selector: 'app-select-role',
  standalone: false,
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.scss'
})
export class SelectRoleComponent implements OnInit {
  roles: Role[] = [];
  // Datos crudos (opcional, por si necesitas depurar)
  rolesRaw: InRole[] = [];

  // Datos transformados listos para la vista
  rolesWithCategories: OutRole[] = [];

  constructor(private adminService: AdministrationService,
    private snackbar: SnackbarService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
  }

  // --- (Opcional) orden útil para CRUD ---
private crudOrder(a: string): number {
  const order: Record<string, number> = { read: 1, create: 2, update: 3, delete: 4 };
  return order[a] ?? 100 + a.charCodeAt(0);
}


  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this.adminService.getRoles().subscribe({
      next: (data) => {
        console.log('Roles:', data);
        this.rolesRaw = data.roles || [];
        this.rolesWithCategories = this.transformRolesToCategories(this.rolesRaw);
        console.log('Roles con categorías:', this.rolesWithCategories);
        this.snackbar.success('Roles cargados');
      },
      error: (err) => {
        console.error('Error al obtener roles:', err);
        this.snackbar.error('Error al obtener roles');
      }
    });
  }

openDialogDeleteRole(event: MouseEvent,role: any) {
  event.stopPropagation();
  console.log('Eliminar role:', role);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '450px',
    data: { message: `Si elimina el rol ${role.name} , se eliminarán los permisos asociados a él, se desasociaran los usuarios que tengan asignado este rol y se eliminará de la lista.
           <b> ¿Estás seguro de que deseas eliminar el role ${role.name} ?   </b> ` }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Role eliminado:', role);
      this.DeleteRole(role);
    }
    else{
      console.log('Permiso no eliminado:', role.name);
      this.snackbar.error('Role no eliminado');
    }
  });

}
// --- Transformador: de roles[] a roles con categories[] ---
private transformRolesToCategories(roles: InRole[], includeMisc = false): OutRole[] {
  return (roles ?? []).map(role => {
    const catMap = new Map<string, OutPermission[]>();
    const misc: OutPermission[] = [];

    for (const p of role.permissions ?? []) {
      const [category, action] = p.name.split(':');

      if (action) {
        const list = catMap.get(category) ?? [];
        if (!list.some(x => x.id === p.id)) list.push({ id: p.id, name: action });
        catMap.set(category, list);
      } else if (includeMisc) {
        if (!misc.some(x => x.id === p.id)) misc.push({ id: p.id, name: p.name });
      }
    }

    const categories: OutCategory[] = Array.from(catMap.entries())
      .map(([name, permissions]) => ({
        name,
        permissions: permissions
          .sort((a, b) =>
            this.crudOrder(a.name) - this.crudOrder(b.name) ||
            a.name.localeCompare(b.name))
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (includeMisc && misc.length) {
      categories.push({ name: 'misc', permissions: misc.sort((a, b) => a.name.localeCompare(b.name)) });
    }

    return { id: role.id, name: role.name, company_id: role.company_id, categories };
  });
}

DeleteRole(role: any) {
  this.adminService.deleteRoleByIdRole(role.id).subscribe({
    next: () => {
      this.snackbar.success('Role eliminado correctamente');
      this.getRoles();
    },
    error: (err) => {
      this.snackbar.error('Error al eliminar el role');
      console.error('Error al eliminar el role', err);
    }
  });
}

openDialog(event: MouseEvent,role: any): void {
  event.stopPropagation();
  const dialogRef = this.dialog.open(RoleCheckBoxComponent, {
    width: '450px',
    data: {isEdit: true,
      title: 'Permisos del rol',
      message: 'Agrega o quitar permisos al rol seleccionado',
      role:role
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const permissions =result.resultFiltered.flatMap((section: any) =>
        section.permissions
          .filter((p: any) => p.checked)
          .map((p: any) => p.id)
      );

      const objPermissions = {
        permissions: permissions
      };


      this.adminService.updateRoleByIdRole(result.role.id, objPermissions).subscribe({
        next: () => {
          this.snackbar.success('✅ Rol actualizado con éxito');
        this.getRoles();
        }
      });
      this.snackbar.success('✅ Rol actualizado con éxito');

    } else {
      this.snackbar.error('✅ Rol no actualizado');
    }
    console.log('El diálogo se cerró con:', result);
  });
}

addRole() {


  const dialogRef = this.dialog.open(CreateRoleComponent, {
    width: '450px',
    data: {isEdit: false,
      title: 'Agregar role nuevo',
      message: 'Aqui creas el nombre del rol y en edicion posterior agregas los permisos',
      role: null
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const company_id = this.authService.getUserCompany_id();
      const roleData = {
        name: result.name,
        company_id: company_id,
        permissions: []

      }
      this.adminService.createRole(roleData).subscribe({
        next: () => {
          this.snackbar.success('✅ Role creado con éxito');
          this.getRoles();
        }
      });
      console.log('result llego del dialogo:', result);
      this.getRoles();
    } else {
      this.snackbar.error('✅ Role no agregado');
    }
  });
}

}
