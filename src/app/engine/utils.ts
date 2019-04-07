export class Utils {
  static getCheckedConfiguration(configuration) {
    if (typeof configuration === 'object' && configuration !== null) {
      return configuration;
    } else if (!configuration) {
      return {};
    } else if (typeof configuration === 'string') {
      return JSON.parse(configuration);
    } else if ( configuration instanceof String) {
      return JSON.parse(configuration as string);
    } else {
      console.warn('Unvalid configuration');
    }
  }
}
