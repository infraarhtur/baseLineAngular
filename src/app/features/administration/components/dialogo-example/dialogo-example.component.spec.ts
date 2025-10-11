import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoExampleComponent } from './dialogo-example.component';

describe('DialogoExampleComponent', () => {
  let component: DialogoExampleComponent;
  let fixture: ComponentFixture<DialogoExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogoExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
