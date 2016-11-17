import { Pipe, PipeTransform } from '@angular/core';
import { MwStatus } from '../models/mw.enum';

@Pipe({ name: 'mwItemStatus' })
export class MwItemStatusPipe implements PipeTransform {
  transform(value: MwStatus) {
  	let result = "";
  	switch(value){
  		case MwStatus.AVAILABLE:
  			result = "在售";
  			break;
  		case MwStatus.UNAVAILABLE:
  			result = "停售";
  			break;
  	}
    return result;
  }
}
