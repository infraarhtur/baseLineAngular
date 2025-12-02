import { Injectable, signal, computed } from '@angular/core';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  permission: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuSignalService {
  // Definición completa de todos los items del menú
  private readonly allMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/home', permission: '' },
    { label: 'Clientes', icon: 'people', route: '/clients', permission: 'client:read' },
    { label: 'Productos', icon: 'inventory_2', route: '/products', permission: 'product:read' },
    { label: 'Proveedores', icon: 'local_shipping', route: '/providers', permission: 'provider:read' },
    { label: 'Ventas', icon: 'point_of_sale', route: '/sales', permission: 'sale:read' },
    { label: 'Categorías', icon: 'category', route: '/category', permission: 'category:read' },
    { label: 'Reportes', icon: 'insert_chart', route: '/reports', permission: 'reports:read' },
    { label: 'Contacto', icon: 'contact_support', route: '/contact', permission: 'contact:read' }
  ];

  // Signal para los permisos del usuario
  private _userPermissions = signal<string[]>([]);

  // Signal computado para los items del menú filtrados por permisos
  public readonly menuItems = computed(() => {
    const permissions = this._userPermissions();

    return this.allMenuItems.filter(item => {
      // Si no tiene permiso requerido, siempre mostrar (ej: Inicio)
      if (!item.permission) {
        return true;
      }
      // Verificar si el usuario tiene el permiso requerido
      return permissions.includes(item.permission);
    });
  });

  /**
   * Actualiza los permisos del usuario y recalcula los items del menú
   * @param permissions - Array de permisos del usuario
   */
  updatePermissions(permissions: string[]): void {
    this._userPermissions.set(permissions);
  }

  /**
   * Obtiene todos los items del menú sin filtrar
   */
  getAllMenuItems(): MenuItem[] {
    return [...this.allMenuItems];
  }

  /**
   * Obtiene los permisos actuales del usuario
   */
  getUserPermissions(): string[] {
    return this._userPermissions();
  }
}

