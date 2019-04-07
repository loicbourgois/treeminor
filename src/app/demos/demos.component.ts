import { Component, OnInit } from '@angular/core';
import { Demo } from '../demo/demo';
import { DownloaderService } from '../services/downloader.service';

@Component({
  selector: 'tmn-demos',
  templateUrl: './demos.component.html',
  styleUrls: ['./demos.component.css']
})
export class DemosComponent implements OnInit {

  private static readonly DEMO_URLS: string [] = [
    'assets/demos/point.json',
    'assets/demos/speed.json',
    'assets/demos/points.json',
    'assets/demos/gravity.json',
    'assets/demos/gravity-2.json',
    'assets/demos/gravity-3.json',
    'assets/demos/gravity-4.json'
  ];
  private demos: Demo [];

  constructor(private downloaderService: DownloaderService) {
    this.demos = [];
    DemosComponent.DEMO_URLS.forEach(url => {
      this.downloaderService.getTextFile(url).subscribe(
        data => {
          this.demos.push(new Demo(data));
        }
      );
    });
  }

  ngOnInit() {
  }

  getDemos() {
    return this.demos;
  }

}
