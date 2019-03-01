import { Component, OnInit } from '@angular/core';
import { DownloaderService } from '../services/downloader.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements OnInit {

  fragmentShaderUrl = 'assets/shaders/world.frag';
  vertexShaderUrl = 'assets/shaders/world.vert';
  
  fragmentShaderSource = '';
  vertexShaderSource = '';
  fragmentShader = null;
  vertexShader = null;

  constructor(private downloaderService: DownloaderService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let canvas : any = document.getElementById('canvas');
    let gl = canvas.getContext('webgl2');
    if(!gl) {
      
    }
    forkJoin(
      this.downloaderService.getTextFile(this.fragmentShaderUrl),
      this.downloaderService.getTextFile(this.vertexShaderUrl)
    ).subscribe(
      data => {
        this.fragmentShaderSource = data[0];
        this.vertexShaderSource = data[1];
        this.vertexShader = this.createShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource);
        this.fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource);
        let program = this.createProgram(gl, this.vertexShader, this.fragmentShader);
      },
      error => console.error(error)
    );
  }

  createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

}
