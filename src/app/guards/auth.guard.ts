import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private cognitoDomain = environment.cognitoDomain;
  private clientId = environment.cognitoClientId;
  private redirectUri = environment.redirectUri;
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
      window.location.href = `${this.cognitoDomain}/login?client_id=${this.clientId}&response_type=token&scope=openid&redirect_uri=${this.redirectUri}`;
      return false;
    }
    return true;
  }
}


