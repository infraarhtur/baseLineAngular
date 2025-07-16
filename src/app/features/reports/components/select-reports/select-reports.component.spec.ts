import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectReportsComponent } from './select-reports.component';

describe('SelectReportsComponent', () => {
  let component: SelectReportsComponent;
  let fixture: ComponentFixture<SelectReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
