import { TestBed } from '@angular/core/testing';

import { PrecricaoService } from './precricao.service';

describe('PrecricaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrecricaoService = TestBed.get(PrecricaoService);
    expect(service).toBeTruthy();
  });
});
