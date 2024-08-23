import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SemanalPage } from './semanal.page';

describe('SemanalPage', () => {
  let component: SemanalPage;
  let fixture: ComponentFixture<SemanalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
