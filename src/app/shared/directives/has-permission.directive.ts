import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

/**
 * Directiva estructural que controla la visibilidad de elementos en el DOM
 * basándose en los permisos del usuario autenticado.
 *
 * Esta directiva verifica si el usuario actual tiene uno o varios permisos
 * consultando el array de permisos almacenado en el payload del token JWT.
 * Si el usuario tiene el/los permiso(s) requerido(s), el elemento se muestra;
 * de lo contrario, se oculta completamente del DOM.
 *
 * @example
 * ```html
 * <!-- Mostrar botón solo si el usuario tiene permiso para crear clientes -->
 * <button *appHasPermission="'client:create'">
 *   Agregar Cliente
 * </button>
 *
 * <!-- Mostrar elemento si el usuario tiene AL MENOS UNO de los permisos (OR) -->
 * <button *appHasPermission="['client:create', 'client:update']">
 *   Crear o Actualizar Cliente
 * </button>
 *
 * <!-- Mostrar elemento solo si el usuario tiene TODOS los permisos (AND) -->
 * <button *appHasPermission="['client:read', 'client:write']" [appHasPermissionRequireAll]="true">
 *   Leer y Escribir Clientes
 * </button>
 *
 * <!-- Mostrar menú solo si el usuario tiene permiso para leer usuarios -->
 * <button mat-menu-item *appHasPermission="'user:read'">
 *   Administrar Usuarios
 * </button>
 * ```
 *
 * @usageNotes
 * - La directiva debe usarse con la sintaxis de directiva estructural: `*appHasPermission="'permission:action'"`
 * - Acepta un string (un permiso) o un array de strings (múltiples permisos).
 * - Por defecto, si se proporcionan múltiples permisos, usa lógica OR (muestra si tiene al menos uno).
 * - Para requerir todos los permisos (lógica AND), usa el input `appHasPermissionRequireAll="true"`.
 * - El permiso debe ser una cadena de texto que coincida exactamente con un permiso
 *   en el array de permisos del token JWT del usuario.
 * - Si el usuario no está autenticado o no tiene el/los permiso(s), el elemento no se renderiza.
 * - Esta directiva está declarada en el SharedModule y debe importarse en los módulos
 *   que necesiten usarla.
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: false,
})
export class HasPermissionDirective {
  /**
   * Almacena el/los permiso(s) que se está(n) verificando.
   * Puede ser un string (un permiso) o un array de strings (múltiples permisos).
   * @private
   */
  private permissions: string | string[] = '';

  /**
   * Indica si se requieren todos los permisos (AND) o solo uno (OR).
   * Por defecto es false, lo que significa que usa lógica OR.
   * @private
   */
  private requireAll: boolean = false;

  /**
   * Constructor de la directiva.
   * @param templateRef Referencia al template que contiene el elemento a mostrar/ocultar.
   * @param viewContainer Contenedor de vistas donde se renderizará o eliminará el elemento.
   * @param authService Servicio de autenticación que proporciona la verificación de permisos.
   */
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  /**
   * Setter del input que recibe el permiso o permisos a verificar.
   * Cuando se asigna un permiso o array de permisos, actualiza la vista automáticamente.
   * @param permission El permiso o array de permisos a verificar.
   *                   Ejemplos: 'client:create' o ['client:create', 'client:update']
   */
  @Input() set appHasPermission(permission: string | string[]) {
    this.permissions = permission;
    this.updateView();
  }

  /**
   * Setter del input que determina si se requieren todos los permisos (AND) o solo uno (OR).
   * Por defecto es false (lógica OR: muestra si tiene al menos uno de los permisos).
   * Si es true (lógica AND: muestra solo si tiene todos los permisos).
   * @param requireAll true para requerir todos los permisos, false para requerir al menos uno.
   */
  @Input() set appHasPermissionRequireAll(requireAll: boolean) {
    this.requireAll = requireAll;
    this.updateView();
  }

  /**
   * Actualiza la vista basándose en si el usuario tiene el/los permiso(s) requerido(s).
   * Si el usuario tiene el/los permiso(s), crea la vista embebida del template.
   * Si no tiene el/los permiso(s), limpia el contenedor de vistas (oculta el elemento).
   * @private
   */
  private updateView() {
    const hasPermission = this.checkPermissions();

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  /**
   * Verifica si el usuario tiene el/los permiso(s) requerido(s).
   * Si es un string, verifica ese permiso único.
   * Si es un array, verifica según la lógica OR (al menos uno) o AND (todos).
   * @returns true si el usuario tiene el/los permiso(s) requerido(s), false en caso contrario.
   * @private
   */
  private checkPermissions(): boolean {
    if (!this.permissions) {
      return false;
    }

    // Si es un string (un solo permiso)
    if (typeof this.permissions === 'string') {
      return this.authService.hasPermission(this.permissions);
    }

    // Si es un array (múltiples permisos)
    if (Array.isArray(this.permissions)) {
      if (this.permissions.length === 0) {
        return false;
      }

      if (this.requireAll) {
        // Lógica AND: debe tener todos los permisos
        return this.permissions.every(permission =>
          this.authService.hasPermission(permission)
        );
      } else {
        // Lógica OR: debe tener al menos uno de los permisos
        return this.permissions.some(permission =>
          this.authService.hasPermission(permission)
        );
      }
    }

    return false;
  }
}
