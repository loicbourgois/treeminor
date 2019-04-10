import { Point } from './point';
import { Utils } from './utils';

export class World {

  private height: number;
  private width: number;
  private points: Point[];
  private gravity: number;

  constructor(world: any) {
    this.loadConfiguration(world);
  }

  loadConfiguration(configuration: any) {
    const world = Utils.getCheckedConfiguration(configuration);
    // Initialise height
    this.height = (world.height !== undefined) ? world.height : 1.0;
    // Initilise width
    this.width = (world.width !== undefined) ? world.width : 1.0;
    // Initialise points
    this.points = [];
    if (world.points) {
      world.points.forEach(point => {
        this.points.push(new Point(point));
      });
    } else {
      // NTD
    }
    // Initialise gravity
    this.gravity = (world.gravity !== undefined) ? world.gravity : 0.0;
  }

  advance(delta: number) {
    this.points.forEach(point => {
      point.resetAcceleration();
    });
    this.points.forEach(point => {
      point.applyGravity(this.points, delta, this.gravity, this.width, this.height);
    });
    this.points.forEach(point => {
      point.updateSpeed(delta);
    });
    this.points.forEach(point => {
      point.moveWithin(delta, -this.width / 2, this.width / 2, -this.height / 2, this.height / 2);
    });
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getPointsPositions() {
    const pointPositions = [];
    this.points.forEach(point => {
      pointPositions.push(point.getPosition().asArray());
    });
    return pointPositions;
  }

  getBackgroundPositions() {
    const halfWidth = this.getWidth() / 2;
    const halfHeight = this.getHeight() / 2;
    const worldPositions = [
      -halfWidth, -halfHeight,
      halfWidth, -halfHeight,
      -halfWidth, halfHeight,
      halfWidth, halfHeight,
      halfWidth, -halfHeight,
      -halfWidth, halfHeight
    ];
    return worldPositions;
  }
}
