import { Color } from './color';
import { Vector } from './vector';
import { Utils } from './utils';

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
    const point = Utils.getCheckedConfiguration(configuration);
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
      const movedPosition = this.getMovedPositionForPoint2(point, worldWidth, worldHeight);
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

    const topIntersect = Vector.getLineLineIntersect(x1, y1, x2, y2,
        -halfW, halfH, -halfW, halfH);
    const botIntersect = Vector.getLineLineIntersect(x1, y1, x2, y2,
        -halfW, -halfH, -halfW, -halfH);
    const leftIntersect = Vector.getLineLineIntersect(x1, y1, x2, y2,
        -halfW, halfH, -halfW, -halfH);
    const rightIntersect = Vector.getLineLineIntersect(x1, y1, x2, y2,
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

  getMovedPositionForPoint2(point, worldWidth, worldHeight) {
    const x1 = this.position.getX();
    const y1 = this.position.getY();
    const x2 = point.position.getX();
    const y2 = point.position.getY();
    const halfW = worldWidth / 2;
    const halfH = worldHeight / 2;

    const topIntersect = Vector.getLineLineIntersect(x1, y1, x2, y2,
        -halfW, halfH, -halfW, halfH);
    const botIntersect = Vector.getLineLineIntersect(x1, y1, x2, y2,
        -halfW, -halfH, -halfW, -halfH);
    const leftIntersect = Vector.getLineLineIntersect(x1, y1, x2, y2,
        -halfW, halfH, -halfW, -halfH);
    const rightIntersect = Vector.getLineLineIntersect(x1, y1, x2, y2,
        halfW, halfH, halfW, -halfH);


    const pairs = [
      {
        position: this.position,
        intersect: topIntersect,
        distanceSquared: Vector.getDistanceSquared(this.position, topIntersect),
      }, {
        position: this.position,
        intersect: botIntersect,
        distanceSquared: Vector.getDistanceSquared(this.position, botIntersect),
      }, {
        position: this.position,
        intersect: leftIntersect,
        distanceSquared: Vector.getDistanceSquared(this.position, leftIntersect),
      }, {
        position: this.position,
        intersect: rightIntersect,
        distanceSquared: Vector.getDistanceSquared(this.position, rightIntersect),
      }, {
        position: point.position,
        intersect: topIntersect,
        distanceSquared: Vector.getDistanceSquared(point.position, topIntersect),
      }, {
        position: point.position,
        intersect: botIntersect,
        distanceSquared: Vector.getDistanceSquared(point.position, botIntersect),
      }, {
        position: point.position,
        intersect: leftIntersect,
        distanceSquared: Vector.getDistanceSquared(point.position, leftIntersect),
      }, {
        position: point.position,
        intersect: rightIntersect,
        distanceSquared: Vector.getDistanceSquared(point.position, rightIntersect),
      }
    ];
    // Order by ascending distance
    pairs.sort((a, b) => {
      if (isNaN(a.distanceSquared)) {
        return 1;
      } else if (isNaN(b.distanceSquared)) {
        return -1;
      } else {
        return a.distanceSquared - b.distanceSquared;
      }
    });

    const firstPair = pairs[0];
    pairs.shift();
    let index = pairs.length - 1;

    while (index >= 0) {
      if (pairs[index].position === firstPair.position || pairs[index].intersect === firstPair.intersect) {
        pairs.splice(index, 1);
      } else {
        // NTD
      }
      index -= 1;
    }
    const secondPair = pairs[0];

    if (firstPair !== undefined && secondPair !== undefined) {
      // NTD
    } else {
      return null;
    }

    const thisIntersect = firstPair.position === this.position ? firstPair.intersect : secondPair.intersect;

    const pointIntersect = secondPair.position === point.position ? secondPair.intersect : firstPair.intersect;

    if (thisIntersect && pointIntersect && thisIntersect !== pointIntersect) {

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
