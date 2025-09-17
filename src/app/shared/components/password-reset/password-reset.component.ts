import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Observable, of } from 'rxjs';
import { CompaniesService, CompanyDto } from '../../services/companies.service';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, catchError, map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-password-reset',
  standalone: false,
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm!: FormGroup;
  submitting = false;

  companies: Array<{ id: string; name: string } > = [];
  filteredCompanies$: Observable<CompanyDto[]> = of([]);
  companySearchLoading = false;
  loadingCompanies = false;
  showSearchResults = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    @Inject(CompaniesService) private companiesService: CompaniesService) {
    }

  ngOnInit(): void {
    this.initForm();

    this.fetchCompanies();
    this.setupCompanyAutocomplete();
  }

  private initForm(): void {
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      company_name: ['', [Validators.required]],
      companyQuery: [''],
    });
  }

  submit(): void {
    if (this.passwordResetForm.valid) {
      this.submitting = true;
      // TODO: Implement password reset logic here
      console.log('Password reset requested for:', this.passwordResetForm.value.email);
      this.authService.resetPassword(this.passwordResetForm.value.email).subscribe({
        next: (data) => {
          console.log(data);
          this.snackbarService.success(data.message);
          setTimeout(() => {
            this.router.navigate(['/login']);
       }, 5000);
        },
        error: (error) => {
          console.log(error);

          this.snackbarService.error('Error al enviar el enlace para restablecer tu contraseña');

        }
      });
      // Simulate API call

    }
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
    ;
    this.filteredCompanies$ = this.passwordResetForm.get('companyQuery')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => (typeof value === 'string' ? value : value?.name ?? '')),
      distinctUntilChanged(),
      switchMap(query => {
        // no side effects here; side effects can close the panel in some setups
        if (!query || query.length < 2) {
          this.companySearchLoading = false;
          this.showSearchResults = false;
          return of([]);
        }
        this.companySearchLoading = true;
        this.showSearchResults = true;
        ;
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
      this.passwordResetForm.get('company_name')!.setValue(company.name);
      this.passwordResetForm.get('companyQuery')!.setValue(company);
    }
  }

  onCompanyInputBlur(): void {
    const value = this.passwordResetForm.get('companyQuery')!.value;
    if (!value || typeof value === 'string') {
      this.passwordResetForm.get('company_name')!.setValue('');
    }
  }

}
