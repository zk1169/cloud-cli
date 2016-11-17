import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'mwDate' })
export class MwDatePipe implements PipeTransform {
  transform(value: any,format:string) {
  	if(value){
  		return moment(value).format(format);
  	}else{
  		return '';
  	}
  }
}

@Pipe({ name: 'mwRelativeDate' })
export class MwRelativeDatePipe implements PipeTransform {
  transform(value: any) {
 	// moment("20111031", "YYYYMMDD").fromNow(); // 5 年前
	// moment("20120620", "YYYYMMDD").fromNow(); // 4 年前
	// moment().startOf('day').fromNow();        // 18 小时前
	// moment().endOf('day').fromNow();          // 6 小时内
	// moment().startOf('hour').fromNow();       // 21 分钟前
	if(value){
  		return moment(value).fromNow();
  	}else{
  		return '';
  	}
  }
}
