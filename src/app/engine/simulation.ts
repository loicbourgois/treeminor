import { Renderer } from './renderer';
import { World } from './world';

export class Simulation {

  private renderer: Renderer;
  private world: World;
  private drawInterval;
  private advanceInterval;
  private lastAdvanceTime: number;

  constructor(worldConfiguration, shadersSource, canvas: any) {
    this.world = new World(worldConfiguration);
    this.renderer = new Renderer(canvas, shadersSource, this.world);
  }

  start() {
    this.renderer.draw();
    this.drawInterval = setInterval(() => {
      this.drawLoop();
    }, 10);
    this.lastAdvanceTime = new Date().getTime();
    this.advanceInterval = setInterval(() => {
      this.advanceLoop();
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
    this.renderer.draw();
  }

  advanceLoop(world) {
    const timeNow = new Date().getTime();
    this.world.advance((timeNow - this.lastAdvanceTime) / 1000.0);
    this.lastAdvanceTime = timeNow;
  }

}
