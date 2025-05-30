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
  constructor(private router: Router, private authService: AuthService) {

  }
  ngOnInit(): void {
    // this.authService.handleAuthCallback();
    // if (!this.authService.isAuthenticated()) {
    //   this.authService.login();

      const token = localStorage.getItem('token');
      if (!token) {
        this.authService.login();
      }
    }

  logout(){
    this.authService.logout();
  }
  redirectToCreateProduct() {
    this.router.navigate(['/products/create']);
  }
  }

