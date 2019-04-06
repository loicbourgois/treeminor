import { Color } from './color';
import { Vector } from './vector';

export class Point {

  private position: Vector;
  private speed: Vector;
  private radius: number;
  private color: Color;
  private mass: number;
  private acceleration: Vector;
  private DISTANCE_TOLERANCE = 0.01;

  constructor(point: any) {
    this.loadConfiguration(point);
  }

  loadConfiguration(configuration: any) {
    if (!configuration) {
      configuration = {};
    } else if (typeof configuration === 'string') {
      configuration = JSON.parse(configuration);
    } else if ( configuration instanceof String) {
      configuration = JSON.parse(configuration as string);
    } else {
      // NTD
    }
    const point = configuration;
    this.position = new Vector(point.position);
    this.speed = new Vector(point.speed);
    this.radius = (point.radius !== undefined) ? point.radius : 1.0;
    this.color = new Color(point.color);
    this.mass = (point.mass !== undefined) ? point.mass : 1.0;
    this.acceleration = new Vector(point.acceleration);
    if (!this.speed.getX() && !this.speed.getY()) {
      this.speed.set(0.0, 0.0);
    }
  }

  resetAcceleration() {
    this.acceleration.set(0.0, 0.0);
  }

  applyGravity(points, delta, gravity, worldWidth, worldHeight) {
    points.forEach(point => {
      const x = point.position.getX();
      const y = point.position.getY();
      const distance = this.getDistanceToCoordinates(x, y);
      const force = distance > this.DISTANCE_TOLERANCE ? - gravity * this.mass * point.mass / (distance * distance) : 0;
      const xDelta = this.position.getX() - x;
      const yDelta = this.position.getY() - y;
      const xForce = xDelta * force;
      const yForce = yDelta * force;
      const xAcceleration = xForce / this.mass;
      const yAcceleration = yForce / this.mass;
      this.acceleration.add(xAcceleration, yAcceleration);
    });
  }

  applyMovedGravity(points, delta, gravity, worldWidth, worldHeight) {
    points.forEach(point => {
      const movedPosition = this.getMovedPositionForPoint(point, worldWidth, worldHeight);
      if (movedPosition !== null) {
        const x = movedPosition.getX();
        const y = movedPosition.getY();
        const distance = this.getDistanceToCoordinates(x, y);
        const force = distance > this.DISTANCE_TOLERANCE ? - gravity * this.mass * point.mass / (distance * distance) : 0.0;
        const xDelta = this.position.getX() - x;
        const yDelta = this.position.getY() - y;
        const xForce = xDelta * force;
        const yForce = yDelta * force;
        const xAcceleration = xForce / this.mass;
        const yAcceleration = yForce / this.mass;
        this.acceleration.add(xAcceleration, yAcceleration);
      }
    });
  }

  getDistanceToPoint(point) {
    return this.getDistanceToCoordinates(point.position.getX(), point.position.getY());
  }

  getDistanceToCoordinates(x, y) {
    const deltaX = x - this.position.getX();
    const deltaY = y - this.position.getY();
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  updateSpeed(delta) {
    const xSpeed = this.speed.getX() + this.acceleration.getX() * delta;
    const ySpeed = this.speed.getY() + this.acceleration.getY() * delta;
    this.speed.set(xSpeed, ySpeed);
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

  move(x: number, y: number) {
    this.position.set(this.position.getX() + x, this.position.getY() + y);
  }

  getPosition() {
    return this.position;
  }

  getMovedPositionForPoint(point, worldWidth, worldHeight) {
    const x1 = this.position.getX();
    const y1 = this.position.getY();
    const x2 = point.position.getX();
    const y2 = point.position.getY();
    const halfW = worldWidth / 2;
    const halfH = worldHeight / 2;

    const topIntersect = Vector.getIntersect(x1, y1, x2, y2,
        -halfW, halfH, -halfW, halfH);
    const botIntersect = Vector.getIntersect(x1, y1, x2, y2,
        -halfW, -halfH, -halfW, -halfH);
    const leftIntersect = Vector.getIntersect(x1, y1, x2, y2,
        -halfW, halfH, -halfW, -halfH);
    const rightIntersect = Vector.getIntersect(x1, y1, x2, y2,
        halfW, halfH, halfW, -halfH);

    const normalizedVector2 = Vector.getVectorFromVectorToVector(this.position, point.position).getNormalized();
    const normalizedVector = Vector.getVectorFromVectorToVector(point.position, this.position).getNormalized();

    const thisIntersect = Vector.getClosestAlongNormal(this.position, [
        topIntersect, botIntersect, leftIntersect, rightIntersect
      ],
      normalizedVector);

    const pointIntersect = Vector.getClosestAlongNormal(point.position, [
        topIntersect, botIntersect, leftIntersect, rightIntersect
      ],
      normalizedVector2);

    if (thisIntersect && pointIntersect) {

      const vectorFromThisToThisIntersect = Vector.getVectorFromVectorToVector(this.position, thisIntersect);

      const vectorFromPointIntersectToPoint = Vector.getVectorFromVectorToVector(pointIntersect, point.position);

      const movedPosition = new Vector({x: this.position.getX(), y: this.position.getY()});
      movedPosition.addVector(vectorFromThisToThisIntersect);
      movedPosition.addVector(vectorFromPointIntersectToPoint);
      return movedPosition;
    } else {
      return null;
    }
  }
}
