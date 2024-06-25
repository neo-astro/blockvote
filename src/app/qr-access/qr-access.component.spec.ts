import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrAccessComponent } from './qr-access.component';

describe('QrAccessComponent', () => {
  let component: QrAccessComponent;
  let fixture: ComponentFixture<QrAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
