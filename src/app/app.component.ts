import { AfterContentInit, Component, OnInit, OnDestroy} from '@angular/core';
import { AuthService } from './services/auth.service';
import { TokenRefreshService } from './services/token-refresh.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserSignalService } from './shared/services/user-signal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterContentInit, OnDestroy {
  title = 'baseLineAngular';
  isExpanded = true;      // rail expandido por defecto en desktop
  isHandset = false;      // móvil/tablet => drawer real
  opened = true;  //cambiar esto a `false` si quieres que el menú inicie cerrado
  isLoggedIn = false;
  userCompany_id: string | null = null;

  constructor(
    private router: Router,
    public authService: AuthService,
    private tokenRefreshService: TokenRefreshService,
    private activatedRoute: ActivatedRoute,
    private bp: BreakpointObserver,
    public userSignalService: UserSignalService
  ) {

    this.sub = this.bp.observe(['(max-width: 768px)'])
    .subscribe(state => {
      this.isHandset = state.matches;
      // En móvil no usamos rail; en desktop lo dejamos como esté
    });
  }
 private sub: Subscription;
  menuItems = [
    { label: 'Inicio', icon: 'home_outline', route: '/home',permission: 'dashboard:read'},
    { label: 'Clientes', icon: 'people', route: '/clients', permission: 'client:read' },
    { label: 'Productos', icon: 'inventory_2', route: '/products', permission: 'product:read' },
    { label: 'Proveedores', icon: 'local_shipping', route: '/providers', permission: 'provider:read' },
    { label: 'Ventas', icon: 'point_of_sale', route: '/sales', permission: 'sale:read' },
    { label: 'Categorías', icon: 'category', route: '/category', permission: 'category:read' },
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', permission:  'dashboard:read' },
    { label: 'Contacto', icon: 'contact_support', route: '/contact', permission: 'contact:read' }
  ];

  ngOnInit(): void {
    /*let route = this.activatedRoute.snapshot;
    while (route.firstChild) {
      route = route.firstChild;
    } */


    const currentUrl =window.location.toString().split('/')[3];

    const publicRoutes = ['login', 'token-validate', 'reset-password', 'reset-password-confirm', 'email-validate'];
    const isPublicRoute = publicRoutes.some(route => currentUrl.startsWith(route));


    if (isPublicRoute) {

      // Si estamos en una ruta pública, solo cargar la info si hay token válido
      const token = this.authService.getToken();
      if (token && !this.authService.isTokenExpired(token)) {
        this.loadInfo();
        // No iniciar el servicio de refresh en rutas públicas
        // this.tokenRefreshService.startAutoRefresh();
      }
      // IMPORTANTE: No hacer logout en rutas públicas, solo retornar
      return;
    }


    // Para rutas protegidas, verificar autenticación
    const token = this.authService.getToken();
    if (!token || this.authService.isTokenExpired(token)) {

      if(isPublicRoute) {
        this.authService.logout();
      } else {
        this.authService.logoutForceRedirect();
      }

      return;
    } else {
      this.loadInfo();

      // Iniciar el servicio de refresh automático de tokens
      this.tokenRefreshService.startAutoRefresh();
    }
  }

  toggleSidenav() {
    this.opened = !this.opened;
  }
  ngAfterContentInit(): void {
    // Solo cargar info si no estamos en una ruta pública
    const currentUrl = window.location.href.split('/')[3];
    const publicRoutes = ['login', 'token-validate', 'reset-password', 'reset-password-confirm', 'email-validate'];
    const isPublicRoute = publicRoutes.some(route => currentUrl.startsWith(route));


    if (!isPublicRoute) {
      this.loadInfo();
      this.verifyMenuPermission();
    }
  }
  logout() {
    // Detener el servicio de refresh automático
    this.tokenRefreshService.stopAutoRefresh();
    // Limpiar los signals de usuario
    this.userSignalService.updateUserName(null);
    this.userSignalService.updateUserCompanyName(null);
    this.authService.logout();
  }
  redirectToCreateProduct() {
    this.router.navigate(['/products/create']);
  }

  loadInfo() {
    this.isLoggedIn = this.authService.isAuthenticated();
    const userInfo = this.authService.getUserName();
    if (userInfo && userInfo.name) {
      this.userSignalService.updateUserName(userInfo.name);
     
    }
    this.userCompany_id = this.authService.getUserCompany_id();
    const companyName = this.authService.getUserCompanyName();
    if (companyName) {
      this.userSignalService.updateUserCompanyName(companyName);
    }
  }

  // Funciones del menú de administración
  closeMenu() {
    // Esta función se puede usar para cerrar el menú si es necesario
    // Por ahora no es necesaria ya que el menú se cierra automáticamente
  }

  openUserProfile() {
    // TODO: Implementar navegación al perfil de usuario
    this.router.navigate(['administration/select-user']);
  }

  openCompanySettings() {
    // TODO: Implementar navegación a configuración de empresa
    console.log('Abrir configuración de empresa');
    this.router.navigate(['administration/select-companies']);
  }

  openSystemSettings() {
    // TODO: Implementar navegación a configuración del sistema
    console.log('Abrir configuración del sistema');
    // this.router.navigate(['/system-settings']);
  }

  openBackupRestore() {
    // TODO: Implementar navegación a respaldo y restauración
    console.log('Abrir respaldo y restauración');
    // this.router.navigate(['/backup-restore']);
  }

  openRolesSettings() {
    // TODO: Implementar navegación a configuración de roles
    console.log('Abrir configuración de roles');
    this.router.navigate(['administration/select-role']);
  }

  toggleRail() {
    this.isExpanded = !this.isExpanded; // solo cambia ancho, no cierra
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  verifyMenuPermission(): void {
    const permissions = this.authService.getAllPermissions().filter(permission => permission.includes(":read"));
    console.log(permissions);
    this.menuItems = this.menuItems.filter(item => permissions.includes(item.permission));
    console.log(this.menuItems);
  }

}

