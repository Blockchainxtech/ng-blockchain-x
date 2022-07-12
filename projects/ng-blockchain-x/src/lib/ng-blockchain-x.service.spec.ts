import { TestBed } from '@angular/core/testing';

import { NgBlockchainXService } from './ng-blockchain-x.service';

describe('NgBlockchainXService', () => {
  let service: NgBlockchainXService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgBlockchainXService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
