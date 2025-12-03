import { AfterContentInit, Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TokenRefreshService } from './services/token-refresh.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { UserSignalService } from './shared/services/user-signal.service';
import { MenuSignalService } from './shared/services/menu-signal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterContentInit, OnDestroy {
  title = 'baseLineAngular';

  // Estado de layout
  isExpanded = true;     // rail expandido por defecto en desktop
  isHandset = false;     // aquí será true solo si width <= 934px
  opened = true;         // en desktop/tablet el sidenav va abierto

  // Otros estados
  isLoggedIn = false;
  userCompany_id: string | null = null;

  private sub!: Subscription;

  constructor(
    private router: Router,
    public authService: AuthService,
    private tokenRefreshService: TokenRefreshService,
    private activatedRoute: ActivatedRoute,
    private bp: BreakpointObserver,
    public userSignalService: UserSignalService,
    public menuSignalService: MenuSignalService
  ) {
    // 🔹 Opción 2: breakpoint custom => móvil si width <= 934px
    this.sub = this.bp
      .observe(['(max-width: 934px)'])
      .pipe(map(result => result.matches))
      .subscribe(isHandset => {
        this.isHandset = isHandset;

        if (isHandset) {
          // En móvil (<= 934px): drawer tipo "over", cerrado por defecto
          this.opened = false;
          this.isExpanded = true;
        } else {
          // >= 935px => tablet / desktop: menú lateral siempre visible
          this.opened = true;
          this.isExpanded = true;
        }
      });
  }

  // Usar el signal del servicio de menú en lugar del array estático
  get menuItems() {
    return this.menuSignalService.menuItems();
  }

  trackByRoute(index: number, item: { route: string }): string {
    return item.route;
  }

  ngOnInit(): void {
    const currentUrl = window.location.toString().split('/')[3];

    const publicRoutes = ['login', 'token-validate', 'reset-password', 'reset-password-confirm', 'email-validate'];
    const isPublicRoute = publicRoutes.some(route => currentUrl.startsWith(route));

    if (isPublicRoute) {
      const token = this.authService.getToken();
      if (token && !this.authService.isTokenExpired(token)) {
        this.loadInfo();
      }
      return;
    }

    const token = this.authService.getToken();
    if (!token || this.authService.isTokenExpired(token)) {
      if (isPublicRoute) {
        this.authService.logout();
      } else {
        this.authService.logoutForceRedirect();
      }
      return;
    } else {
      this.loadInfo();
      this.tokenRefreshService.startAutoRefresh();
    }
  }

  toggleSidenav() {
    this.opened = !this.opened;
  }

  onSidenavClose() {
    if (this.isHandset) {
      this.opened = false;
    }
  }

  onSidenavToggle(event: boolean) {
    if (this.isHandset) {
      this.opened = event;
    }
  }

  ngAfterContentInit(): void {
    const currentUrl = window.location.href.split('/')[3];
    const publicRoutes = ['login', 'token-validate', 'reset-password', 'reset-password-confirm', 'email-validate'];
    const isPublicRoute = publicRoutes.some(route => currentUrl.startsWith(route));

    if (!isPublicRoute) {
      this.loadInfo();
      this.verifyMenuPermission();
    }
  }

  logout() {
    this.tokenRefreshService.stopAutoRefresh();
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

  closeMenu() { }

  openUserProfile() {
    this.router.navigate(['administration/select-user']);
  }

  openCompanySettings() {
    this.router.navigate(['administration/select-companies']);
  }

  openSystemSettings() {
    console.log('Abrir configuración del sistema');
  }

  openBackupRestore() {
    console.log('Abrir respaldo y restauración');
  }

  openRolesSettings() {
    console.log('Abrir configuración de roles');
    this.router.navigate(['administration/select-role']);
  }

  toggleRail() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  verifyMenuPermission(): void {
    const permissions = this.authService
      .getAllPermissions()
      .filter(permission => permission.includes(':read'));
    this.menuSignalService.updatePermissions(permissions);
    console.log('Permisos del usuario:', permissions);
  }
}
