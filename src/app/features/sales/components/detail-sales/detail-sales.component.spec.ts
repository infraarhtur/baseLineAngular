import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSalesComponent } from './detail-sales.component';

describe('DetailSalesComponent', () => {
  let component: DetailSalesComponent;
  let fixture: ComponentFixture<DetailSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
