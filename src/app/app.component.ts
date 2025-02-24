import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'baseLineAngular';
  constructor(private authService: AuthService) {}
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
    console.log('holaaa amigo')
    this.authService.logout();
  }
  }

