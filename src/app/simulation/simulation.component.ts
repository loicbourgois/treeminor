import { Component, AfterViewInit } from '@angular/core';
import { Input } from '@angular/core';
import { DownloaderService } from '../services/downloader.service';
import { forkJoin } from 'rxjs';
import { Renderer } from '../engine/renderer';
import { World } from '../engine/world';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tmn-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements AfterViewInit {

  private pWorldConfiguration = '';
  private drawInterval;
  private advanceInterval;
  private lastAdvanceTime;

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

  constructor(private downloaderService: DownloaderService,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.route.paramMap.subscribe( params => {
      this.stop();
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
          const renderer = new Renderer(canvas, shadersSource, world);
          this.start(renderer, world);
        },
        error => console.error(error)
      );
    });
  }

  start(renderer, world) {
    renderer.draw();
    this.drawInterval = setInterval(() => {
      this.drawLoop(renderer);
    }, 10);
    this.lastAdvanceTime = new Date().getTime();
    this.advanceInterval = setInterval(() => {
      this.advanceLoop(world);
    }, 10);
  }

  stop() {
    if (this.drawInterval) {
      clearInterval(this.drawInterval);
    }
    if (this.advanceInterval) {
      clearInterval(this.advanceInterval);
    }
  }

  drawLoop(renderer) {
    renderer.draw();
  }

  advanceLoop(world) {
    const timeNow = new Date().getTime();
    world.advance((timeNow - this.lastAdvanceTime) / 1000.0);
    this.lastAdvanceTime = timeNow;
  }
}
