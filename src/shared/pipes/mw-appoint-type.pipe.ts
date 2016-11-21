import { Pipe, PipeTransform } from '@angular/core';
import { AppointType } from '../models/mw.enum';

@Pipe({ name: 'mwAppointType' })
export class MwAppointTypePipe implements PipeTransform {
  transform(value: AppointType) {
  	let result = "";
  	switch(value){
  		case AppointType.TIME:
  			result = "点钟";
  			break;
  		case AppointType.TURN:
        result = "轮牌";
        break;
  	}
    return result;
  }
}
