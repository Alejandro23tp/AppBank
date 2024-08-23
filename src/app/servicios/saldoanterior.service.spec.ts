import { TestBed } from '@angular/core/testing';

import { SaldoanteriorService } from './saldoanterior.service';

describe('SaldoanteriorService', () => {
  let service: SaldoanteriorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaldoanteriorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
