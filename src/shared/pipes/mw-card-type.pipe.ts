import { Pipe, PipeTransform } from '@angular/core';
import { CardType } from '../models/mw.enum';

@Pipe({ name: 'mwCardType' })
export class MwCardTypePipe implements PipeTransform {
  transform(value: CardType) {
  	let result = "";
  	switch(value){
  		case CardType.DISCOUNT:
  			result = "折扣卡";
  			break;
  		case CardType.CASH:
        result = "储值卡";
        break;
      case CardType.TIME:
        result = "时段卡";
        break;
      case CardType.TIMES_TOTAL:
        result = "疗程总次卡";
        break;
      case CardType.TIMES:
        result = "疗程分次卡";
        break;
  	}
    return result;
  }
}
