export class Vector {

  private x: float;
  private y: float;

  constructor(vector: any) {
    this.x = (vector.x !== undefined) ? vector.x : 0.0;
    this.y = (vector.y !== undefined) ? vector.y : 0.0;
  }
}
