import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportByPeriodComponent } from './sale-report-by-period.component';

describe('SaleReportByPeriodComponent', () => {
  let component: SaleReportByPeriodComponent;
  let fixture: ComponentFixture<SaleReportByPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleReportByPeriodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleReportByPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
