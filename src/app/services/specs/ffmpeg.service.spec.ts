import { TestBed } from '@angular/core/testing';

import { FfmpegService } from '../ffmpeg.service';

xdescribe('FfmpegService', () => {
  let service: FfmpegService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfmpegService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
