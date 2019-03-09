export class Point {

  private position: Vector;
  private speed: Vector;
  private radius: float;
  private color: Color;

  constructor(point: any) {
    this.position = new Vector(point.position);
    this.speed = new Vector(point.speed);
    this.radius = (point.radius !== undefined) ? point.radius : 1.0;
    this.color = new Color(point.color);
  }
}
