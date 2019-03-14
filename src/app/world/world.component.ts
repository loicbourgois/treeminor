import { Component, AfterViewInit } from '@angular/core';
import { Input } from '@angular/core';
import { DownloaderService } from '../services/downloader.service';
import { forkJoin } from 'rxjs';
import { Renderer } from '../engine/renderer';
import { World } from '../engine/world';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tmn-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements AfterViewInit {

  private pWorldConfiguration = '';

  @Input()
  set worldConfiguration(worldConfiguration: string) {
    this.pWorldConfiguration = worldConfiguration;
  }

  get worldConfiguration(): string { return this.pWorldConfiguration; }

  fragmentShaderUrl = 'assets/shaders/default.frag';
  vertexShaderUrl = 'assets/shaders/default.vert';
  worldFragmentShaderUrl = 'assets/shaders/world.frag';
  worldVertexShaderUrl = 'assets/shaders/world.vert';

  fragmentShaderSource = '';
  vertexShaderSource = '';
  fragmentShader = null;
  vertexShader = null;

  renderer = null;
  world = null;

  constructor(private downloaderService: DownloaderService,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.route.paramMap.subscribe( params => {
      forkJoin(
        this.downloaderService.getTextFile(this.fragmentShaderUrl),
        this.downloaderService.getTextFile(this.vertexShaderUrl),
        this.downloaderService.getTextFile(this.worldFragmentShaderUrl),
        this.downloaderService.getTextFile(this.worldVertexShaderUrl)
      ).subscribe(
        data => {
          const fragmentShaderSource = data[0];
          const vertexShaderSource = data[1];
          const worldFragmentShaderSource = data[2];
          const worldVertexShaderSource = data[3];
          const canvas: any = document.getElementById('canvas');
          this.world = new World(this.pWorldConfiguration);
          console.log(this.pWorldConfiguration, this.world.width);
          this.renderer = new Renderer(canvas, fragmentShaderSource,
              vertexShaderSource, worldFragmentShaderSource,
              worldVertexShaderSource);
        },
        error => console.error(error)
      );
    });
  }
}
