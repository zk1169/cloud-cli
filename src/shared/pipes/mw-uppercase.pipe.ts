import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'mwUppercase' })
export class MwUppercasePipe implements PipeTransform {
  transform(value: string) {
    return value.toUpperCase();
  }
}
