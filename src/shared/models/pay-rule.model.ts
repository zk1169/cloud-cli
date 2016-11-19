import { PayRuleType,PresentType,DiscountType } from './mw.enum';
import { UserService } from '../services/user.service';
import { MoneyTool } from './money-tool.model';

export class CardPresentRule{
	name:string;
	price:number;
	money:number;
	amount:number;
	type:PresentType;
	typeId:number;

	constructor(){}

	serializer(model:any){
		this.name = model.name;
		this.price = model.price;
		this.money = model.money;
		this.amount = model.amount;
		this.type = <PresentType>model.presentType;
		this.typeId = model.presentTypeId;
		return this;
	}

	unserializer(){
		let model:any = {};
		model.name = this.name;
		model.price = this.price;
		model.money = this.money;
		model.amount = this.amount;
		model.presentType = +this.type;
		model.presentTypeId = this.typeId;
		return model;
	}
}

export class StoreRule{
	storeId:number;
	storeName:string;
	discountType:DiscountType;
	discountValue:number;

	constructor(storeId?:number,storeName?:string){
		this.storeId = storeId;
		this.storeName = storeName;
		this.discountType = DiscountType.DISCOUNT;
		this.discountValue = 100;
	}

	getDiscountMoney(unpay:number):number{
		let dMoney:number;
		switch(this.discountType){
			case DiscountType.DISCOUNT:
				dMoney = MoneyTool.sub(unpay,unpay * this.discountValue/100);
				break;
			case DiscountType.REDUCE:
				dMoney = this.discountValue;
			case DiscountType.NEW_PRICE:
				dMoney = MoneyTool.sub(unpay,this.discountValue);
				break;
		}
		return dMoney;
	}

	getPayInfo():string{
		let pInfo:string;
		switch(this.discountType){
			case DiscountType.DISCOUNT:
				pInfo = this.discountValue/10 + '折';
				break;
			case DiscountType.REDUCE:
				pInfo = '减免' + this.discountValue;
			case DiscountType.NEW_PRICE:
				pInfo = '会员价' + this.discountValue;
				break;
		}
		return pInfo;
	}

	serializer(model:any,userService?:UserService){
		this.storeId = +model.storeIds;
		this.storeName = model.storeName;
		if(model.type == PayRuleType.ALL){
			this.storeName = '全店通用';
		}else if(userService && !this.storeName){
			this.storeName = userService.getStoreNameById(this.storeId);
		}
		this.discountType = <DiscountType>model.discountType;
		switch(this.discountType){
			case DiscountType.DISCOUNT:
				this.discountValue = model.discountValue;
				break;
			case DiscountType.REDUCE:
			case DiscountType.NEW_PRICE:
				this.discountValue = MoneyTool.point2yuan(model.discountValue);
				break;
		}
		return this;
	}
}

export class PayRule{
	name:string;
	type:PayRuleType;
	typeId:number;
	balance:number;
	categoryCode:string;
	//discountType:number;
	//discountValue:number;
	storeIds:string;
	storeRuleList:StoreRule[];
	selected:boolean;
	
	constructor(){}

	checkPay(option:{itemId:number,itemCategory:string,storeId:number}){
		let payFlag:boolean = false;
		switch(this.type){
			case PayRuleType.ALL:
				payFlag = true;
				break;
			case PayRuleType.STORE:
				break;
			case PayRuleType.PRODUCT:
				break;
			case PayRuleType.SERVICE_ITEM:
				if(option.itemId == this.typeId){
					payFlag = true;
				}else{
					payFlag = false;
				}
				break;
			case PayRuleType.SERVICE_PACKAGE:
				break;
			case PayRuleType.SERVICE_ITEM_CATEGORY:
				break;
			case PayRuleType.SERVICE_PACKAGE_CATEGORY:
				break;
			case PayRuleType.PRODUCT_CATEGORY:
				break;
			case PayRuleType.ALL_CATEGORY:
				break;
		}
		return payFlag;
	}

	getPayInfo(storeId:number):string{
		let pInfo:string;
		if(this.storeRuleList && this.storeRuleList.length > 0){
			if(this.type == PayRuleType.ALL){
				//全店通用
				pInfo = this.storeRuleList[0].getPayInfo();
			}else{
				this.storeRuleList.forEach((item:StoreRule)=>{
					if(item && item.storeId == storeId){
						pInfo = item.getPayInfo();
						//return;
					}
				});
			}
		}else{
			pInfo = '';
		}
		return pInfo;
	}

	getDiscountMoney(unpay:number,storeId:number):number{
		let dMoney:number;
		if(this.storeRuleList && this.storeRuleList.length > 0){
			if(this.type == PayRuleType.ALL){
				//全店通用
				dMoney = this.storeRuleList[0].getDiscountMoney(unpay);
			}else{
				this.storeRuleList.forEach((item:StoreRule)=>{
					if(item && item.storeId == storeId){
						dMoney = item.getDiscountMoney(unpay);
						//return;
					}
				});
			}
		}else{
			dMoney = unpay;
		}
		return dMoney;
	}

	get id(){
		return this.type + '_' + this.typeId;
	}

	static createAllStoreRule(){
		let allRule:PayRule = new PayRule();
		allRule.categoryCode = '0';
		allRule.name = '全店通用';
		allRule.type = PayRuleType.ALL;
		return allRule;
	}

	static serializer(rules:any[],userService?:UserService):PayRule[]{
		let pRules:PayRule[] = [];
		if(rules){
			rules.forEach((item:any)=>{
				let sameItemFlag = false;
				if(pRules.length > 0){
					pRules.forEach((ruleItem:PayRule)=>{
						if(ruleItem.typeId==item.typeId && ruleItem.type == item.type && item.storeIds){
							ruleItem.storeRuleList.push(new StoreRule().serializer(item,userService));
							sameItemFlag = true;
							return;
						}
					});
				}
				if(!sameItemFlag){
					pRules.push(new PayRule().serializer(item,userService));
				}
			});
		}
		return pRules;
	}

	serializer(model:any,userService?:UserService){
		this.balance = model.balance;
		this.categoryCode = model.categoryCode;
		//this.discountType = model.discountType;
		//this.discountValue = model.discountValue;
		this.name = model.name;
		if(model.id && model.id > 0){
			this.type = <PayRuleType>model.typeId;
			this.typeId = model.id;
		}else{
			this.type = <PayRuleType>model.type;
			this.typeId = model.typeId;
		}
		//this.type = model.id>0?<PayRuleType>model.typeId:<PayRuleType>model.type;
		//this.typeId = model.id || model.typeId;
		if(this.type == PayRuleType.ALL){
			this.categoryCode = this.type+'';
		}else{
			this.storeIds = model.storeIds;
		}
		this.storeRuleList = [new StoreRule().serializer(model,userService)];
		
		return this;
	}

	unserializer(){
		let model:any[] = [];
		if(this.storeRuleList){
			this.storeRuleList.forEach((item:StoreRule)=>{
				model.push({
					categoryCode:this.categoryCode,
					name:this.name,
					type:+this.type,
					typeId:this.typeId,
					storeIds:item.storeId,
					discountType:item.discountType,
					discountValue:item.discountValue
				});
			});
		}
		//model.categoryCode = this.categoryCode;
		//model.discountType = this.discountType;
		//model.discountValue = this.discountValue;
		//model.name = this.name;
		//model.storeIds = this.storeIds;
		//model.type = +this.type;
		//model.typeId = this.typeId;
		return model;
	}
}