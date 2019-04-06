import { Renderer } from './renderer';
import { World } from './world';

export class Simulation {

  private renderer: Renderer;
  private world: World;
  private drawInterval;
  private advanceInterval;
  private lastTime: number;
  private STEP = 0.05;
  private STEP_SECOND;

  constructor(worldConfiguration, shadersSource, canvas: any) {
    this.STEP_SECOND = this.STEP / 1000.0;
    this.world = new World(worldConfiguration);
    this.renderer = new Renderer(canvas, shadersSource, this.world);
  }

  start() {
    this.renderer.draw();
    this.drawInterval = setInterval(() => {
      this.drawLoop();
    }, 0);
    this.lastTime = new Date().getTime();
    this.world.advance(this.STEP / 10.0);
    this.advanceInterval = setInterval(() => {
      this.advanceLoop();
    }, 0);
  }

  stop() {
    if (this.drawInterval) {
      clearInterval(this.drawInterval);
    }
    if (this.advanceInterval) {
      clearInterval(this.advanceInterval);
    }
  }

  drawLoop() {
    this.renderer.draw();
  }

  advanceLoop() {
    const timeNow = new Date().getTime();
    let delta = timeNow - this.lastTime;
    while (delta > this.STEP) {
      delta -= this.STEP;
      this.world.advance(this.STEP_SECOND);
    }
    this.lastTime = timeNow - delta;
  }

}
