import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProvidersComponent } from './select-providers.component';

describe('SelectProvidersComponent', () => {
  let component: SelectProvidersComponent;
  let fixture: ComponentFixture<SelectProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectProvidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
