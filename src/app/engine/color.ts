export class Color {

  private r: float;
  private g: float;
  private b: float;
  private a: float;

  constructor(color: Object) {
    this.r = (color.r !== undefined) ? color.r : 0.5;
    this.g = (color.g !== undefined) ? color.g : 0.5;
    this.b = (color.b !== undefined) ? color.b : 0.5;
    this.a = (color.a !== undefined) ? color.a : 1.0;
  }
}
