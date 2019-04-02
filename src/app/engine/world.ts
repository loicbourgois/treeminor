import { Point } from './point';

export class World {

  private height: number;
  private width: number;
  private points: Point[];

  constructor(world: any) {
    this.loadConfiguration(world);
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
    const world = JSON.parse(jsonConfiguration);
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
    const width = this.getWidth();
    const height = this.getHeight();
    const worldPositions = [
      -width, -height,
      width, -height,
      -width, height,
      width, height,
      width, -height,
      -width, height
    ];
    return worldPositions;
  }
}
