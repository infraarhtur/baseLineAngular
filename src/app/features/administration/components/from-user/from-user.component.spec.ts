import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromUserComponent } from './from-user.component';

describe('FromUserComponent', () => {
  let component: FromUserComponent;
  let fixture: ComponentFixture<FromUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FromUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
