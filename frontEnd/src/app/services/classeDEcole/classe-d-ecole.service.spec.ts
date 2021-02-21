import { TestBed } from '@angular/core/testing';

import { ClasseDEcoleService } from './classe-d-ecole.service';

describe('ClasseDEcoleService', () => {
  let service: ClasseDEcoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasseDEcoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
