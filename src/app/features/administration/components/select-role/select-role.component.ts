import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdministrationService } from '../../service/administration.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Router } from '@angular/router';

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
    private router: Router) {
  }

  // --- (Opcional) orden útil para CRUD ---
private crudOrder(a: string): number {
  const order: Record<string, number> = { read: 1, create: 2, update: 3, delete: 4 };
  return order[a] ?? 100 + a.charCodeAt(0);
}


  ngOnInit() {
  this.roles = this.getExampleRoles() as Role[]
    this.getRoles();

  }
  removePermission(role: Role, perm: Permission) {
    role.permissions = role.permissions.filter(p => p.id !== perm.id);
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

deletePermission(id: string) {
  console.log('Eliminar permiso con ID:', id);
}




getExampleRoles() {


  return  [
    {
      "id": "20000000-0000-0000-0000-000000000001",
      "name": "admin",
      "company_id": "00000000-0000-0000-0000-000000000001",
      "permissions": [

        {
          "id": "fea3ba35-4489-4fc3-9037-504ea5afa841",
          "name": "user:read"
        },
        {
          "id": "320feefe-7467-43e0-83bd-8f5f5c6651bf",
          "name": "user:create"
        },
        {
          "id": "1a7ed8b8-aef8-428b-a39b-c9a3678399e7",
          "name": "user:update"
        },
        {
          "id": "a6dc66a2-126e-48ef-a1db-7c9ad6ae0649",
          "name": "user:delete"
        },
        {
          "id": "77f8c2c8-0782-4c1f-bc27-740936cf098f",
          "name": "company:read"
        },
        {
          "id": "4772c37a-0797-419d-a154-d618b9b15c8f",
          "name": "company:create"
        },
        {
          "id": "864dfcb3-0979-4af4-99de-f14464c784f4",
          "name": "company:update"
        },
        {
          "id": "43923e81-1b47-4546-9ac5-2f6cb0972403",
          "name": "company:delete"
        },
        {
          "id": "41592a05-8afd-453d-a3c2-309661719efa",
          "name": "role:read"
        },
        {
          "id": "cee14831-0929-4b56-9411-4d9abe192505",
          "name": "role:create"
        },
        {
          "id": "4179213f-a434-4b6f-9a80-18e9bfb68569",
          "name": "role:update"
        },
        {
          "id": "92e93b7d-3c81-4527-b2ec-adc337c716b2",
          "name": "role:delete"
        },
        {
          "id": "83da9238-2acc-4b0c-bb08-082bfc436cb4",
          "name": "permission:read"
        },
        {
          "id": "3542e07d-c5b8-4360-a52d-86b518644d58",
          "name": "permission:assign"
        },
        {
          "id": "ad85e94f-02d1-4d23-9d01-d5d16d07da0c",
          "name": "system:admin"
        },
        {
          "id": "ca4d2439-8e33-4b2e-aabd-555825f3ec92",
          "name": "dashboard:read"
        },
        {
          "id": "b553e5f3-da30-4daa-9f24-f3b832913102",
          "name": "reports:read"
        },
        {
          "id": "e738ba99-b6b7-44e5-8bac-697389b3415a",
          "name": "settings:read"
        },
        {
          "id": "3e80c34a-c365-40dd-9569-3f3a4394da53",
          "name": "settings:update"
        }
      ]
    },
    {
      "id": "20000000-0000-0000-0000-000000000002",
      "name": "user",
      "company_id": "00000000-0000-0000-0000-000000000001",
      "permissions": [
        {
          "id": "30000000-0000-0000-0000-000000000002",
          "name": "view_reports"
        },
        {
          "id": "77f8c2c8-0782-4c1f-bc27-740936cf098f",
          "name": "company:read"
        }
      ]
    },
    {
      "id": "3d8acef0-bf5a-4139-b159-e6e4fdbccafd",
      "name": "cashier_1",
      "company_id": "00000000-0000-0000-0000-000000000001",
      "permissions": [
        {
          "id": "fea3ba35-4489-4fc3-9037-504ea5afa841",
          "name": "user:read"
        },
        {
          "id": "320feefe-7467-43e0-83bd-8f5f5c6651bf",
          "name": "user:create"
        },
        {
          "id": "1a7ed8b8-aef8-428b-a39b-c9a3678399e7",
          "name": "user:update"
        }
      ]
    },
    {
      "id": "06029467-6ab5-4045-a05b-674dd2ef9ad7",
      "name": "cashier_2",
      "company_id": "00000000-0000-0000-0000-000000000001",
      "permissions": [
        {
          "id": "fea3ba35-4489-4fc3-9037-504ea5afa841",
          "name": "user:read"
        },
        {
          "id": "320feefe-7467-43e0-83bd-8f5f5c6651bf",
          "name": "user:create"
        },
        {
          "id": "1a7ed8b8-aef8-428b-a39b-c9a3678399e7",
          "name": "user:update"
        }
      ]
    },
    {
      "id": "ba52d1c3-551e-49e0-82dc-6d211aea0e07",
      "name": "cashier_3",
      "company_id": "00000000-0000-0000-0000-000000000001",
      "permissions": [
        {
          "id": "fea3ba35-4489-4fc3-9037-504ea5afa841",
          "name": "user:read"
        },
        {
          "id": "320feefe-7467-43e0-83bd-8f5f5c6651bf",
          "name": "user:create"
        },
        {
          "id": "1a7ed8b8-aef8-428b-a39b-c9a3678399e7",
          "name": "user:update"
        }
      ]
    },
    {
      "id": "19ee7808-9a21-4a2e-809e-23e634ac1229",
      "name": "cashier_4",
      "company_id": "00000000-0000-0000-0000-000000000001",
      "permissions": [

      ]
    },
    {
      "id": "285aed59-60ee-41c8-b770-679eee86ec9c",
      "name": "cashier_5",
      "company_id": "00000000-0000-0000-0000-000000000001",
      "permissions": [

      ]
    }
  ]
}

// --- Transformador: de roles[] a roles con categories[] ---

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

addPermission(id: string) {
  console.log('Agregar permiso con ID:', id);
}
}
