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
  pointsFragmentShaderUrl = 'assets/shaders/points.frag';
  pointsVertexShaderUrl = 'assets/shaders/points.vert';

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
        this.downloaderService.getTextFile(this.worldVertexShaderUrl),
        this.downloaderService.getTextFile(this.pointsFragmentShaderUrl),
        this.downloaderService.getTextFile(this.pointsVertexShaderUrl)
      ).subscribe(
        data => {
          const canvas: any = document.getElementById('canvas');
          const world = new World(this.pWorldConfiguration);
          const shadersSource = {
            default:  {
              frag: data[0],
              vert: data[1]
            },
            world: {
              frag: data[2],
              vert: data[3]
            },
            points: {
              frag: data[4],
              vert: data[5]
            }
          };
          this.renderer = new Renderer(canvas, shadersSource, world);
        },
        error => console.error(error)
      );
    });
  }
}
