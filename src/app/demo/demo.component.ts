import { Component, OnInit } from '@angular/core';
import { Demo } from './demo';
import { ActivatedRoute } from '@angular/router';
import { DownloaderService } from '../services/downloader.service';

@Component({
  selector: 'tmn-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  private demo: Demo;

  constructor(private route: ActivatedRoute,
              private downloaderService: DownloaderService) { }

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      const id = params.get('id');
      this.downloaderService.getTextFile(`assets/demos/${id}.json`).subscribe(
        data => {
          this.demo = new Demo(data);
        }
      );
    });
  }
}
