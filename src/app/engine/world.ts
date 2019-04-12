import { Point } from './point';
import { Utils } from './utils';

const MODE_VERLET = 1;
const MODE_EULER = 2;

export class World {

  private height: number;
  private width: number;
  private points: Point[];
  private gravity: number;
  private mode: number;

  //
  //
  //
  constructor(configuration: any) {
    this.loadConfiguration(configuration);
  }

  //
  //
  //
  loadConfiguration(configuration: any) {
    const checkedConfiguration = Utils.getCheckedConfiguration(configuration);
    // Initialise height
    this.height = (checkedConfiguration.height !== undefined) ? checkedConfiguration.height : 1.0;
    // Initilise width
    this.width = (checkedConfiguration.width !== undefined) ? checkedConfiguration.width : 1.0;
    // Initialise mode
    switch (checkedConfiguration.mode) {
      case 'euler':
        this.mode = MODE_EULER;
        break;
      case 'verlet':
        this.mode = MODE_VERLET;
        break;
      default:
        this.mode = MODE_VERLET;
        break;
    }
    // Initialise points
    this.points = [];
    if (checkedConfiguration.points) {
      checkedConfiguration.points.forEach(point => {
        this.points.push(new Point(point));
      });
    } else {
      // NTD
    }
    // Initialise gravity
    this.gravity = (checkedConfiguration.gravity !== undefined) ? checkedConfiguration.gravity : 0.0;
  }

  //
  // Advance all the points in this world
  // Different advance mode are availables
  //
  advance(deltaTime: number) {
    switch (this.mode) {
      case MODE_VERLET:
        this.advanceVerlet(deltaTime);
        break;
      case MODE_EULER:
        this.advanceEuler(deltaTime);
        break;
      default:
        console.error('Not a valid mode : ' + this.mode);
        break;
    }
  }

  //
  // https://stackoverflow.com/questions/32709599/the-time-corrected-verlet-numerical-integration-formula
  //
  advanceTimeCorrectedVerletProper() {
  }

  //
  // http://lonesock.net/article/verlet.html
  //
  advanceTimeCorrectedVerlet(delta: number) {
  }

  //
  // Advance using Verlet Integration
  //
  // See wikipedia for explanation
  // https://en.wikipedia.org/wiki/Verlet_integration#Verlet_integration_(without_velocities)
  //
  advanceVerlet(deltaTime: number) {
    this.points.forEach(point => {
      point.resetForces();
    });
    this.points.forEach(point => {
      point.addGravityForces(this.points, this.gravity, this.width, this.height);
    });
    this.points.forEach(point => {
      point.updateAcceleration();
    });
    this.points.forEach(point => {
      point.updatePositionVerlet(deltaTime);
    });
    this.points.forEach(point => {
      point.recenter(this.width, this.height);
    });
  }

  //
  // Advance using Euler method
  //
  // See Wikipedia for explanation
  // https://en.wikipedia.org/wiki/Euler_method
  //
  advanceEuler(deltaTime: number) {
    this.points.forEach(point => {
      point.resetForces();
    });
    this.points.forEach(point => {
      point.addGravityForces(this.points, this.gravity, this.width, this.height);
    });
    this.points.forEach(point => {
      point.updateAcceleration();
    });
    this.points.forEach(point => {
      point.updateSpeed(deltaTime);
    });
    this.points.forEach(point => {
      point.move(deltaTime);
    });
    this.points.forEach(point => {
      point.recenter(this.width, this.height);
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
