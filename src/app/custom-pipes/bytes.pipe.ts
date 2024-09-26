import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytes'
})
export class BytesPipe implements PipeTransform {

  // Filter inspired by https://gist.github.com/thomseddon/3511330
  transform(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    if (isNaN(bytes) || !isFinite(bytes)) {
      return '-';
    }
    let units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
    let number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, Math.floor(number))).
    toFixed(1) + ' ' + units[number];
  }

}
