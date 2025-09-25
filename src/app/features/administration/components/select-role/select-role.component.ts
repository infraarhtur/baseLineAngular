import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

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

@Component({
  selector: 'app-select-role',
  standalone: false,
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.scss'
})
export class SelectRoleComponent implements OnInit {

  displayedColumns: string[] = ['permission', 'administrator', 'editor', 'viewer'];
  dataSource = new MatTableDataSource<Permission>();

  roles = ['ADMINISTRADOR', 'EDITOR', 'VISUALIZADOR'];
  rolePermissions: { [role: string]: { [permissionId: string]: boolean } } = {
    'ADMINISTRADOR': {},
    'EDITOR': {},
    'VISUALIZADOR': {}
  };

  permissions: Permission[] = [
    // Gestión de Usuarios
    { id: 'user_management', name: 'Gestión de Usuarios', category: 'user_management', isCategory: true },
    { id: 'create_users', name: 'Crear Usuarios', category: 'user_management', isCategory: false },
    { id: 'edit_users', name: 'Editar Usuarios', category: 'user_management', isCategory: false },
    { id: 'delete_users', name: 'Eliminar Usuarios', category: 'user_management', isCategory: false },
    { id: 'view_users', name: 'Ver Lista de Usuarios', category: 'user_management', isCategory: false },

    // Control de Contenido
    { id: 'content_control', name: 'Control de Contenido', category: 'content_control', isCategory: true },
    { id: 'publish_articles', name: 'Publicar Artículos', category: 'content_control', isCategory: false },
    { id: 'edit_articles', name: 'Editar Artículos', category: 'content_control', isCategory: false },
    { id: 'delete_articles', name: 'Eliminar Artículos', category: 'content_control', isCategory: false },
    { id: 'view_articles', name: 'Ver Artículos', category: 'content_control', isCategory: false }
  ];

  ngOnInit() {
    this.dataSource.data = this.permissions;
    this.initializePermissions();
  }

  initializePermissions() {
    // Initialize with default permissions based on the image
    this.rolePermissions = {
      'ADMINISTRADOR': {
        'create_users': true,
        'edit_users': true,
        'delete_users': true,
        'view_users': true,
        'publish_articles': true,
        'edit_articles': true,
        'delete_articles': true,
        'view_articles': true
      },
      'EDITOR': {
        'create_users': false,
        'edit_users': false,
        'delete_users': false,
        'view_users': true,
        'publish_articles': true,
        'edit_articles': true,
        'delete_articles': false,
        'view_articles': true
      },
      'VISUALIZADOR': {
        'create_users': false,
        'edit_users': false,
        'delete_users': false,
        'view_users': true,
        'publish_articles': false,
        'edit_articles': false,
        'delete_articles': false,
        'view_articles': true
      }
    };
  }

  onPermissionChange(permissionId: string, role: string, checked: boolean) {
    if (!this.rolePermissions[role]) {
      this.rolePermissions[role] = {};
    }
    this.rolePermissions[role][permissionId] = checked;
  }

  isPermissionChecked(permissionId: string, role: string): boolean {
    return this.rolePermissions[role]?.[permissionId] || false;
  }

  isCategoryRow(element: Permission): boolean {
    return element.isCategory;
  }

  getPermissionRowClass(element: Permission): string {
    return element.isCategory ? 'category-row' : 'permission-row';
  }

  savePermissions() {
    console.log('Saving permissions:', this.rolePermissions);
    // Here you would typically send the data to your backend service
  }
}
