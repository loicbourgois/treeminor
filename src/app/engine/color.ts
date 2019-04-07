import { Utils } from './utils';

export class Color {

  private r: number;
  private g: number;
  private b: number;
  private a: number;

  constructor(color: any) {
    this.loadConfiguration(color);
  }

  loadConfiguration(configuration: any) {
    const color = Utils.getCheckedConfiguration(configuration);
    this.r = (color.r !== undefined) ? color.r : 0.5;
    this.g = (color.g !== undefined) ? color.g : 0.5;
    this.b = (color.b !== undefined) ? color.b : 0.5;
    this.a = (color.a !== undefined) ? color.a : 1.0;
  }
}
