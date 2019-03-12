import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyJson'
})
export class PrettyJsonPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return JSON.stringify(JSON.parse(value), null, 4);
  }

}
