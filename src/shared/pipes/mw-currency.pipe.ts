import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'mwCurrency' })
export class MwCurrencyPipe implements PipeTransform {
  transform(value: any) {
  	if(typeof(value) == "number"){
  		return "¥ " + value.toFixed(2);
  	}else if(typeof(value) == "string"){
  		return "¥ " + Number(value).toFixed(2);
  	}else{
  		return '';
  	}
    
  }
}
