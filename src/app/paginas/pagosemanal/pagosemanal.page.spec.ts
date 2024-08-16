import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagosemanalPage } from './pagosemanal.page';

describe('PagosemanalPage', () => {
  let component: PagosemanalPage;
  let fixture: ComponentFixture<PagosemanalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosemanalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
