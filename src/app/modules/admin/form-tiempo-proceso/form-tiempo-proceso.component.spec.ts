import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTiempoProcesoComponent } from './form-tiempo-proceso.component';

describe('FormTiempoProcesoComponent', () => {
  let component: FormTiempoProcesoComponent;
  let fixture: ComponentFixture<FormTiempoProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTiempoProcesoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTiempoProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
