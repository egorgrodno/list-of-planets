import { TestBed, inject } from '@angular/core/testing';

import { MockEntityService } from './mock-entity.service';

describe('MockEntityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockEntityService]
    });
  });

  it('should be created', inject([MockEntityService], (service: MockEntityService) => {
    expect(service).toBeTruthy();
  }));
});
