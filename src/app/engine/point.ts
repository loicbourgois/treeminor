import { Color } from './color';
import { Vector } from './vector';

export class Point {

  private position: Vector;
  private speed: Vector;
  private radius: number;
  private color: Color;
  private mass: number;

  constructor(point: any) {
    this.loadConfiguration(point);
  }

  loadConfiguration(configuration: any) {
    let jsonConfiguration: string;
    if (!configuration) {
      jsonConfiguration = '{}';
    } else if (typeof configuration === 'string') {
      jsonConfiguration = configuration;
    } else if ( configuration instanceof String) {
      jsonConfiguration = configuration as string;
    } else {
      jsonConfiguration = JSON.stringify(configuration);
    }
    const point = JSON.parse(jsonConfiguration);
    this.position = new Vector(point.position);
    this.speed = new Vector(point.speed);
    this.radius = (point.radius !== undefined) ? point.radius : 1.0;
    this.color = new Color(point.color);
    this.mass = (point.mass !== undefined) ? point.mass : 1.0;
  }

  moveWithin(delta: number, xMin: number, xMax: number, yMin: number, yMax: number) {
    let x = this.position.getX() + this.speed.getX() * delta;
    x += xMax - xMin - xMin;
    while (x > (xMax - xMin)) {
      x -= (xMax - xMin);
    }
    x += xMin;
    let y = this.position.getY() + this.speed.getY() * delta;
    y += yMax - yMin - yMin;
    while (y > (yMax - yMin)) {
      y -= (yMax - yMin);
    }
    y += yMin;
    this.position.set(x, y);
  }

  getPosition() {
    return this.position;
  }
}
