import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSalesComponent } from './home-sales.component';

describe('HomeSalesComponent', () => {
  let component: HomeSalesComponent;
  let fixture: ComponentFixture<HomeSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
