import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mwCardRule' })
export class MwCardRulePipe implements PipeTransform {
  transform(value: number,discountType:number) {
  	let result:string = '';
  	switch(discountType){
  		case 1:
  			result = value/10 +'折';
  			break;
  		case 2:
  			result = '抵扣 ¥'+value;
  			break;
  		case 3:
  			result = '会员价 ¥'+value;
  			break;
  	}
  	return result;
  }
}