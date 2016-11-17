import { ISerializer } from './base.model';
import { ItemBaseModel } from './item-base.model';
import { OrderItemType } from './mw.enum';
import { MoneyTool } from './money-tool.model';

export class ServiceItemModel extends ItemBaseModel implements ISerializer{
	serviceDuration:number;

	constructor(id?:number){
		super(id);
		this.type = OrderItemType.SERVICE_ITEM;
	}

	serializer(model:any){
		super.serializer(model);
		this.serviceDuration = model.serviceDuration;
		return this;
	}

	unserializer(){
		let model = super.unserializer();
		model.serviceDuration = this.serviceDuration;
		model.serviceItemFileList = [];
		if(this.storeList){
			model.serviceItemStoreList = [];
			let sellingPrice = this.price;
			this.storeList.forEach((item:any)=>{
				model.serviceItemStoreList.push({
        			storeId:item.id,
        			saleStatus:1,
        			sellingPrice:MoneyTool.yuan2point(sellingPrice)
        		});
			});
        	
        }
		return model;
	}
}