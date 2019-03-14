export class Color {

  private r: number;
  private g: number;
  private b: number;
  private a: number;

  constructor(color: any) {
    this.loadConfiguration();
  }

  loadConfiguration(configuration: any) {
    let jsonConfiguration: string;
    if (!configuration) {
      jsonConfiguration = '{}';
    } else if (typeof configuration === 'string') {
      jsonConfiguration = configuration;
    } else if ( configuration instanceof String) {
      jsonConfiguration = configuration as string;
    } else {
      jsonConfiguration = JSON.stringify(configuration);
    }
    const color = JSON.parse(jsonConfiguration);
    this.r = (color.r !== undefined) ? color.r : 0.5;
    this.g = (color.g !== undefined) ? color.g : 0.5;
    this.b = (color.b !== undefined) ? color.b : 0.5;
    this.a = (color.a !== undefined) ? color.a : 1.0;
  }
}
