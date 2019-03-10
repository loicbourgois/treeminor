export class Demo {

  private description: string;
  private title: string;
  private configuration: string;

  constructor(demo: any) {
    this.description = (demo.description !== undefined) ? demo.description : '';
    this.title = (demo.title !== undefined) ? demo.title : '';
    this.configuration = (demo.configuration !== undefined) ? demo.configuration : '';
  }
}
