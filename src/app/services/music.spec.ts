import { TestBed } from '@angular/core/testing';

import { MusicService } from './music';

describe('Music', () => {
  let service: Music;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Music);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
