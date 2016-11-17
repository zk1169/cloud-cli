import { ISerializer } from './base.model';
import { ItemBaseModel } from './item-base.model';

export class ProductModel extends ItemBaseModel implements ISerializer{
	constructor(id?:number){
		super(id);
	}

	serializer(model:any){
		super.serializer(model);
		return this;
	}
}