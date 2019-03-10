import { Point } from './point';

export class World {

  private height: number;
  private width: number;
  private points: Point[];

  constructor(world: any) {
    // Initialise height
    this.height = (world.height !== undefined) ? world.height : 1.0;
    // Initilise width
    this.width = (world.width !== undefined) ? world.width : 1.0;
    // Initialise points
    this.points = [];
    if (world.points) {
      world.points.forEach(function(point) {
        this.points.push(new Point(point));
      });
    } else {
      // NTD
    }
  }
}
