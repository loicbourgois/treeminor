import { TestBed } from '@angular/core/testing';

import { DownloaderService } from './downloader.service';

xdescribe('DownloaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloaderService = TestBed.get(DownloaderService);
    expect(service).toBeTruthy();
  });
});
