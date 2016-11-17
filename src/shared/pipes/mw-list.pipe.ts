import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'mwListPipe' })
export class MwListPipe implements PipeTransform {
  transform(list: any[],searchText:string) {
  	if(!list){
  		return [];
  	}
  	if(!searchText || searchText == ''){
  		return list;
  	}
  	//return list.filter(item => item.itemModel.name.indexOf(searchText)>-1);
  	return list.filter(item => item.filter(searchText));
  }
}
