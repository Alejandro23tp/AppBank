import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegPrestamosPage } from './reg-prestamos.page';

describe('RegPrestamosPage', () => {
  let component: RegPrestamosPage;
  let fixture: ComponentFixture<RegPrestamosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegPrestamosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
