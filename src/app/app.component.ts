import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'baseLineAngular';
  opened = false;  //cambiar esto a `false` si quieres que el menú inicie cerrado
  isLoggedIn = false;
  userName: string | null = null;
  userCompany_id: string | null = null;
  userCompanyName: string | null = null;
  constructor(private router: Router, public authService: AuthService) {

  }
  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token || this.authService.isTokenExpired(token)) {
     // this.authService.login();
      return;
    }else{
    this.isLoggedIn = true;
    this.userName = this.authService.getUserName();
   this.userCompany_id = this.authService.getUserCompany_id();
    this.userCompanyName = this.authService.getUserCompanyName();
    const payload = this.authService.getTokenPayload();
    if (payload?.exp) {
      const msToExpiry = payload.exp * 1000 - Date.now();
      if (msToExpiry > 0) {
        setTimeout(() => this.logout(), msToExpiry);
      }
    }
    }

  }

  logout(){
    this.authService.logout();
  }
  redirectToCreateProduct() {
    this.router.navigate(['/products/create']);
  }
  }

