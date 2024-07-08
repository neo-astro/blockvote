import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelProcesosComponent } from './panel-procesos.component';

describe('PanelProcesosComponent', () => {
  let component: PanelProcesosComponent;
  let fixture: ComponentFixture<PanelProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelProcesosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
