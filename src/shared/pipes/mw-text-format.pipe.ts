import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'mwTextFormat' })
export class MwTextFormatPipe implements PipeTransform {
  transform(value: any) {
  	switch(value){
  		case null:
  		case undefined:
  		case "null":
  		case "undefined":
  			value = '';
  			break;
  		default:
  			if(typeof(value) == "string"){
  				value = value.trim();
  			}
  			break;
  	}
    return value;
  }
}
