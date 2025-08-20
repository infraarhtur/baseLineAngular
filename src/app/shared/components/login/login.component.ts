import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CompaniesService, CompanyDto } from '../../services/companies.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, catchError, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  companies: Array<{ id: string; name: string } > = [];
  filteredCompanies$: Observable<CompanyDto[]> = of([]);
  companySearchLoading = false;
  loadingCompanies = false;
  submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    @Inject(CompaniesService) private companiesService: CompaniesService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      companyQuery: ['']
    });
  }

  ngOnInit(): void {
    this.fetchCompanies();
    this.setupCompanyAutocomplete();
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

  setupCompanyAutocomplete(): void {
    this.filteredCompanies$ = this.loginForm.get('companyQuery')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => (typeof value === 'string' ? value : value?.name ?? '')),
      distinctUntilChanged(),
      switchMap(query => {
        // no side effects here; side effects can close the panel in some setups
        if (!query || query.length < 2) {
          this.companySearchLoading = false;
          return of(this.companies);
        }
        this.companySearchLoading = true;
        return this.companiesService.searchCompanies(query).pipe(
          catchError(() => of([])),
          tap(() => (this.companySearchLoading = false))
        );
      })
    );
  }

  displayCompany(company: CompanyDto | string | null): string {
    if (!company) return '';
    if (typeof company === 'string') return company;
    return company.name;
  }

  onCompanySelected(company: CompanyDto): void {
    if (company && company.id) {
      this.loginForm.get('company_name')!.setValue(company.name);
      this.loginForm.get('companyQuery')!.setValue(company);
    }
  }

  onCompanyInputBlur(): void {
    const value = this.loginForm.get('companyQuery')!.value;
    if (!value || typeof value === 'string') {
      this.loginForm.get('company_name')!.setValue('');
    }
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, company_name } = this.loginForm.value;
    localStorage.setItem('selected_company_id', company_name);
    localStorage.setItem('login_email', email);
    this.submitting = true;
    this.authService.login(email, password, company_name).subscribe({
      next: () => {
        this.submitting = false;
      },
      error: () => {
        this.submitting = false;
      }
    });
  }
}


