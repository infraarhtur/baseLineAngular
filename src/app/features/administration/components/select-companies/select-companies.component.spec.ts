import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCompaniesComponent } from './select-companies.component';

describe('SelectCompaniesComponent', () => {
  let component: SelectCompaniesComponent;
  let fixture: ComponentFixture<SelectCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectCompaniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
