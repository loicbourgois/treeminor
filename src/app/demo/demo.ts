export class Demo {

  private description: string;
  private title: string;
  private configuration: string;
  private id: string;

  constructor(demo: any) {
    this.loadConfiguration(demo);
  }

  loadConfiguration(configuration: any) {
    let jsonConfiguration: string;
    if (typeof configuration === 'string') {
      jsonConfiguration = configuration;
    } else if ( configuration instanceof String) {
      jsonConfiguration = configuration as string;
    } else {
      jsonConfiguration = JSON.stringify(configuration);
    }
    const demo = JSON.parse(jsonConfiguration);
    demo.configuration = jsonConfiguration;
    this.description = (demo.description !== undefined) ? demo.description : '';
    this.title = (demo.title !== undefined) ? demo.title : '';
    this.configuration = (demo.configuration !== undefined) ? demo.configuration : '';
    this.id = (demo.id !== undefined) ? demo.id : undefined;
  }
}
