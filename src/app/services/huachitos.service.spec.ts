import { TestBed } from '@angular/core/testing';

import { HuachitosService } from './huachitos.service';

describe('HuachitosService', () => {
  let service: HuachitosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HuachitosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
