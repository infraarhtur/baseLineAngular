import { AfterContentInit, Component, OnInit, OnDestroy} from '@angular/core';
import { AuthService } from './services/auth.service';
import { TokenRefreshService } from './services/token-refresh.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  userName: string | null = null;
  userCompany_id: string | null = null;
  userCompanyName: string | null = null;

  constructor(
    private router: Router,
    public authService: AuthService,
    private tokenRefreshService: TokenRefreshService,
    private activatedRoute: ActivatedRoute,
    private bp: BreakpointObserver
  ) {

    this.sub = this.bp.observe(['(max-width: 768px)'])
    .subscribe(state => {
      this.isHandset = state.matches;
      // En móvil no usamos rail; en desktop lo dejamos como esté
    });
  }
 private sub: Subscription;
  menuItems = [
    { label: 'Inicio', icon: 'home_outline', route: '/home' },
    { label: 'Clientes', icon: 'people', route: '/clients' },
    { label: 'Productos', icon: 'inventory_2', route: '/products' },
    { label: 'Proveedores', icon: 'local_shipping', route: '/providers' },
    { label: 'Ventas', icon: 'point_of_sale', route: '/sales' },
    { label: 'Categorías', icon: 'category', route: '/category' },
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Contacto', icon: 'contact_mail', route: '/contact' }
  ];

  ngOnInit(): void {
    /*let route = this.activatedRoute.snapshot;
    while (route.firstChild) {
      route = route.firstChild;
    } */


    const currentUrl =window.location.toString().split('/')[3];
    console.log('AppComponent ngOnInit - Current URL:', currentUrl);

    const publicRoutes = ['login', 'token-validate', 'reset-password', 'reset-password-confirm', 'email-validate'];
    const isPublicRoute = publicRoutes.some(route => currentUrl.startsWith(route));
    console.log('AppComponent ngOnInit - Is public route:', isPublicRoute);

    if (isPublicRoute) {
      console.log('AppComponent ngOnInit - Processing public route');
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

    console.log('AppComponent ngOnInit - Processing protected route');
    // Para rutas protegidas, verificar autenticación
    const token = this.authService.getToken();
    if (!token || this.authService.isTokenExpired(token)) {
      console.log('AppComponent ngOnInit - No valid token, redirecting to login');
      // Si no hay token o está expirado, redirigir al login
      this.authService.logout();
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
    console.log('AppComponent ngAfterContentInit - Is public route:', isPublicRoute);

    if (!isPublicRoute) {
      this.loadInfo();
    }
  }
  logout() {
    // Detener el servicio de refresh automático
    this.tokenRefreshService.stopAutoRefresh();
    this.authService.logout();
  }
  redirectToCreateProduct() {
    this.router.navigate(['/products/create']);
  }

  loadInfo() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.userName = this.authService.getUserName().name;
    this.userCompany_id = this.authService.getUserCompany_id();
    this.userCompanyName = this.authService.getUserCompanyName();
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
    // this.router.navigate(['/company-settings']);
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

}

