export class Demo {

  private description: string;
  private title: string;

  constructor(demo: any) {
    this.description = (demo.description !== undefined) ? demo.description : '';
    this.title = (demo.title !== undefined) ? demo.title : '';
  }
}
