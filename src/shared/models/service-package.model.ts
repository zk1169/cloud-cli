import { ISerializer } from './base.model';
import { ItemBaseModel } from './item-base.model';

export class ServicePackageModel extends ItemBaseModel implements ISerializer{
	constructor(id?:number){
		super(id);
	}
}