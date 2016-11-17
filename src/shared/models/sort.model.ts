export class SortModel{
	sortField:string;
	sortType:string;

	constructor(sField:string,sType:string){
		this.sortField = sField;
		this.sortType = sType;
	}

	get hasSort(){
		if(!this.sortType || this.sortType == ''){
			return false;
		}else{
			return true;
		}
	}

	reverse(){
		if(this.sortType == 'desc'){
			this.sortType = 'asc';
		}else{
			this.sortType = 'desc'
		}
	}

	unserializer(){
		let model = {
			field:this.sortField,
			sort:this.sortType
		}
		return model;
	}
}