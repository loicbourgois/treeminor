export class Vector {

  private x: number;
  private y: number;

  constructor(vector: any) {
    this.loadConfiguration(vector);
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
    const vector = JSON.parse(jsonConfiguration);
    this.x = (vector.x !== undefined) ? vector.x : 0.0;
    this.y = (vector.y !== undefined) ? vector.y : 0.0;
  }
}
