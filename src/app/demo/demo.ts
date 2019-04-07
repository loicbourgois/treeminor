import { Utils } from '../engine/utils';

export class Demo {

  private description: string;
  private title: string;
  private configuration: string;
  private id: string;

  constructor(demo: any) {
    this.loadConfiguration(demo);
  }

  loadConfiguration(configuration: any) {
    const demo = Utils.getCheckedConfiguration(configuration);
    demo.configuration = configuration;
    this.description = (demo.description !== undefined) ? demo.description : '';
    this.title = (demo.title !== undefined) ? demo.title : '';
    this.configuration = (demo.configuration !== undefined) ? demo.configuration : '';
    this.id = (demo.id !== undefined) ? demo.id : undefined;
  }

  getWorldConfiguration() {
    const worldConfiguration = JSON.stringify((JSON.parse(this.configuration)).configuration.world);
    return worldConfiguration;
  }

  getConfiguration() {
    return this.configuration;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }
}
