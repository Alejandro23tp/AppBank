import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoparticipantePage } from './nuevoparticipante.page';

describe('NuevoparticipantePage', () => {
  let component: NuevoparticipantePage;
  let fixture: ComponentFixture<NuevoparticipantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoparticipantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
