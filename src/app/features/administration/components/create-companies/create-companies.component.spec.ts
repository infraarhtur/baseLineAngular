import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompaniesComponent } from './create-companies.component';

describe('CreateCompaniesComponent', () => {
  let component: CreateCompaniesComponent;
  let fixture: ComponentFixture<CreateCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCompaniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
