import { AfterContentInit, Component, OnInit, } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TokenRefreshService } from './services/token-refresh.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterContentInit {
  title = 'baseLineAngular';
  opened = false;  //cambiar esto a `false` si quieres que el menú inicie cerrado
  isLoggedIn = false;
  userName: string | null = null;
  userCompany_id: string | null = null;
  userCompanyName: string | null = null;
  constructor(
    private router: Router,
    public authService: AuthService,
    private tokenRefreshService: TokenRefreshService
  ) {

  }
  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token || this.authService.isTokenExpired(token)) {
      // this.authService.login();
      return;
    } else {
      this.loadInfo();

      // Iniciar el servicio de refresh automático de tokens
      this.tokenRefreshService.startAutoRefresh();
    }
  }
  ngAfterContentInit(): void {
    this.loadInfo();
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
    this.userName = this.authService.getUserName();
    this.userCompany_id = this.authService.getUserCompany_id();
    this.userCompanyName = this.authService.getUserCompanyName();
  }
}

