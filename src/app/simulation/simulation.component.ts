import { Component, AfterViewInit } from '@angular/core';
import { Input } from '@angular/core';
import { DownloaderService } from '../services/downloader.service';
import { forkJoin } from 'rxjs';
import { Simulation } from '../engine/simulation';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tmn-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements AfterViewInit {

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
        shadersData => {
          this.init(shadersData);
          this.start();
        },
        error => console.error(error)
      );
    });
  }

  stop() {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  init(shadersData) {
    const canvas: any = document.getElementById('canvas');
    const shadersSource = {
      default:  {
        frag: shadersData[0],
        vert: shadersData[1]
      },
      world: {
        frag: shadersData[2],
        vert: shadersData[3]
      },
      points: {
        frag: shadersData[4],
        vert: shadersData[5]
      }
    };
    this.simulation = new Simulation(this.pWorldConfiguration, shadersSource, canvas);
  }

  start() {
    this.simulation.start();
  }
}
