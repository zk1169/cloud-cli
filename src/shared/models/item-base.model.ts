import { BaseModel,ISerializer } from './base.model';
import { MwStatus } from './mw.enum';
import { MoneyTool } from './money-tool.model';
import { OrderItemType } from './mw.enum';
import { StoreModel,StorePriceModel } from './store.model';
import { UserService } from '../services/user.service';

export class ItemBaseModel extends BaseModel implements ISerializer{
	name:string;
	price:number;
	serialNo:string;
	code:string;
	categoryLevel:string;
	type:OrderItemType;
	storeList:StoreModel[];
	description:string;
	changed:boolean;

	private _status:number;
	private _acceptBooking:number;

	constructor(id?:number){
		super(id);
	}

	get status():MwStatus{
		if(this._status){
			return <MwStatus>this._status;
		}else{
			return MwStatus.AVAILABLE;
		}
	}
	set status(value:MwStatus){
		this._status = value;
	}

	get acceptBooking():MwStatus{
		if(this._acceptBooking){
			return <MwStatus>this._acceptBooking;
		}else{
			return MwStatus.AVAILABLE;
		}
	}

	set acceptBooking(value:MwStatus){
		this._acceptBooking = value;
	}
	get itemType(){
		let _itemType:string;
		switch(this.type){
			case OrderItemType.PRODUCT:
				_itemType = 'PRODUCT';
				break;
			case OrderItemType.SERVICE_ITEM:
				_itemType = 'SERVICE_ITEM';
				break;
			case OrderItemType.SERVICE_PACKAGE:
				_itemType = 'SERVICE_PACKAGE';
				break;
			case OrderItemType.CARD:
				_itemType = 'CARD';
				break;
		}
		return _itemType;
	}

	// get storeId(){
	// 	if(this.store){
	// 		return this.store.id;
	// 	}else{
	// 		return null;
	// 	}
	// }
	// set storeId(value:number){
	// 	if(!this.store){
	// 		this.store = new StoreModel(value);
	// 	}else{
	// 		this.store.id = value;
	// 	}
	// }

	// initStoreList(userService:UserService){
	// 	if(this.storeList){
	// 		this.storeList.forEach((item:StoreModel)=>{
	// 			let sModel:StoreModel = userService.getStoreById(item.id);
	// 			if(sModel){
	// 				item.name = sModel.name;
	// 			}
	// 		});
	// 	}
	// }

	serializer(model:any,userService?:UserService){
		super.serializer(model.itemId||model.id);
		this.name = model.itemName||model.name;
		this.price = MoneyTool.point2yuan(model.sellingPrice || model.price || model.actualPerPrice);
		this.serialNo = model.code;
		this.code = model.code;
		this.categoryLevel = model.categoryLevel;
		this._status = model.status;
		this._acceptBooking = model.acceptBooking;
		//this.type = model.saleType || model.itemType;
		this.storeList = [];
		if(model.serviceItemStoreList){
			model.serviceItemStoreList.forEach((item:any)=>{
				if(item.saleStatus == 1){
					this.storeList.push(new StorePriceModel().serializer(item,userService));
				}
			});
		}
		if(model.storeIds){
			this.storeList = [];
			let stores:any[] = model.storeIds.split(',');
			stores.forEach((item:any)=>{
				this.storeList.push(new StoreModel().serializer({id:+item},userService));
			});
		}
		return this;
	}

	unserializer(){
        let model = super.unserializer();
        //model.itemId = this.id;
        //model.itemName = this.name;
        model.name = this.name;
        //model.itemType = this._type;
        model.sellingPrice = MoneyTool.yuan2point(this.price);
        model.description = this.description;
        model.status = this._status;
        model.acceptBooking = this._acceptBooking;
        model.code = this.code;
        //model.storeId = this.storeId;
        return model;
    }

}
