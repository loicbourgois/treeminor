import { Component, AfterViewInit } from '@angular/core';
import { DownloaderService } from '../services/downloader.service';
import { forkJoin } from 'rxjs';
import { Renderer } from '../engine/renderer';
import { World } from '../engine/world';

@Component({
  selector: 'tmn-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements AfterViewInit {

  fragmentShaderUrl = 'assets/shaders/world.frag';
  vertexShaderUrl = 'assets/shaders/world.vert';

  fragmentShaderSource = '';
  vertexShaderSource = '';
  fragmentShader = null;
  vertexShader = null;

  renderer = null;
  world = null;

  constructor(private downloaderService: DownloaderService) {
  }

  ngAfterViewInit() {
    forkJoin(
      this.downloaderService.getTextFile(this.fragmentShaderUrl),
      this.downloaderService.getTextFile(this.vertexShaderUrl)
    ).subscribe(
      data => {
        const fragmentShaderSource = data[0];
        const vertexShaderSource = data[1];
        const canvas: any = document.getElementById('canvas');
        this.world = new World(10, 10);
        this.renderer = new Renderer(canvas, fragmentShaderSource, vertexShaderSource);
      },
      error => console.error(error)
    );
  }
}
