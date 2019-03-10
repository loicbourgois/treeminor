export class World {

  private height: number;
  private width: number;

  constructor(world: any) {
    this.height = (world.height !== undefined) ? world.height : 1.0;
    this.width = (world.width !== undefined) ? world.width : 1.0;
  }
}
