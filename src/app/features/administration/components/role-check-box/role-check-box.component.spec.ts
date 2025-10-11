import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleCheckBoxComponent } from './role-check-box.component';

describe('RoleCheckBoxComponent', () => {
  let component: RoleCheckBoxComponent;
  let fixture: ComponentFixture<RoleCheckBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleCheckBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
