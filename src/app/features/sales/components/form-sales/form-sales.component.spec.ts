import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSalesComponent } from './form-sales.component';

describe('FormSalesComponent', () => {
  let component: FormSalesComponent;
  let fixture: ComponentFixture<FormSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
