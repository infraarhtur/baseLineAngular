import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSaleByProductsComponent } from './report-sale-by-products.component';

describe('ReportSaleByProductsComponent', () => {
  let component: ReportSaleByProductsComponent;
  let fixture: ComponentFixture<ReportSaleByProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportSaleByProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSaleByProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
