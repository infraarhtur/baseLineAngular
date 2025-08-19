import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CompaniesService } from '../../services/companies.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  companies: Array<{ id: string; name: string } > = [];
  loadingCompanies = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    @Inject(CompaniesService) private companiesService: CompaniesService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      companyId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchCompanies();
  }

  fetchCompanies(): void {
    this.loadingCompanies = true;
    this.companiesService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies ?? [];
        this.loadingCompanies = false;
      },
      error: () => {
        this.companies = [];
        this.loadingCompanies = false;
      }
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, companyId } = this.loginForm.value;
    localStorage.setItem('selected_company_id', companyId);
    localStorage.setItem('login_email', email);

    this.authService.login();
  }
}


