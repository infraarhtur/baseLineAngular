import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProvidersComponent } from './form-providers.component';

describe('FormProvidersComponent', () => {
  let component: FormProvidersComponent;
  let fixture: ComponentFixture<FormProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormProvidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
