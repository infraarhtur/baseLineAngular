import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // canActivate(): boolean {
  //   if (this.authService.isAuthenticated()) {
  //     return true;
  //   } else {
  //     this.authService.login();
  //     return false;
  //   }
  // }



  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'https://us-east-1cifmpvh0b.auth.us-east-1.amazoncognito.com/login?client_id=2kgl9phf326v4ts8sudrdapjsp&response_type=token&scope=openid&redirect_uri=http://localhost:4200/';
      return false;
    }
    return true;
  }
}


