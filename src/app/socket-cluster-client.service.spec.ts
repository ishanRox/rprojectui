import { TestBed } from '@angular/core/testing';

import { SocketClusterClientService } from './socket-cluster-client.service';

describe('SocketClusterClientService', () => {
  let service: SocketClusterClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketClusterClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
