import { ItemBaseModel } from './item-base.model';
import { CardType,OrderItemType,DiscountType } from './mw.enum';
import { PayRule } from './pay-rule.model';
import { UserService } from '../services/user.service';
import { MoneyTool } from './money-tool.model';

export class CardBaseModel extends ItemBaseModel{
	type:OrderItemType;
	cardType:CardType;
	sellType:number;//销售类型
	holderStatus:number;//卡类型
	payRules:PayRule[];
	useRule:PayRule;

	constructor(type:CardType,id?:number){
		super(id);
		this.type = OrderItemType.CARD;
		this.cardType = type;
	}

	get discountType():DiscountType{
		if(this.useRule){
			return this.useRule.discountType;
		}else{
			return DiscountType.NONE; 
		}
	}

	get moneyOrTimes(){
		let flag:string;
		switch(this.cardType){
			default:
				flag = "money";
				break;
			case CardType.TIMES_TOTAL:
			case CardType.TIMES:
				flag = "times";
				break;
		}
		return flag;
	}

	checkPay(option:{itemId:number,itemCategory:string,storeId:number}){
		//let payFlag:boolean = false;
		let result:any = {payFlag:false};
		if(this.payRules){
			this.payRules.forEach((item:PayRule)=>{
				if(item){
					result.payFlag = item.checkPay(option);
					if(result.payFlag){
						this.useRule = item;
						//优先使用第一个找到能支付的规则
						return;
					}
				}
			});
		}
		if(!result.payFlag){
			this.useRule = null;
			result.noInfo = '不能支付这个项目';
		}
		return result;
	}

	getPayInfo(storeId:number):string{
		if(this.useRule){
			return this.useRule.getPayInfo(storeId);
		}else{
			return '';
		}
	}

	getDiscountMoney(unpay:number,itemId:number,storeId:number):number{
		let dMoney = unpay;
		if(this.useRule){
			dMoney = this.useRule.getDiscountMoney(unpay,storeId);
		}
		return dMoney;
	}

	getCardMoney(unpay:number,balance:number){
		return 0;
	}

	static serializer(model:any,userService?:UserService){
		let cType:CardType = <CardType>model.type;
		let cardModel:CardBaseModel;
		switch(cType){
			case CardType.DISCOUNT:
				cardModel = new CardDiscountModel(model.id).serializer(model,userService);
				break;
			case CardType.CASH:
				cardModel = new CardCashModel(model.id).serializer(model,userService);
				break;
			case CardType.TIME:
				cardModel = new CardTimeModel(model.id).serializer(model,userService);
				break;
			case CardType.TIMES_TOTAL:
				cardModel = new CardTimesTotalModel(model.id).serializer(model,userService);
				break;
			case CardType.TIMES:
				cardModel = new CardTimesModel(model.id).serializer(model,userService);
				break;
		}
		return cardModel;
	}

	serializer(model:any,userService?:UserService){
		super.serializer(model,userService);
		if(model.payRules){
			this.payRules = PayRule.serializer(model.payRules,userService);
			// model.payRules.forEach((item:any)=>{
			// 	if(item){
			// 		this.payRules.push(new PayRule().serializer(item));
			// 	}
			// });
		}

		this.code = model.cardNo;
		this.holderStatus = model.holderStatus;
		this.sellType = model.sellType;
		this.description = model.cardIntro;
		return this;
	}

	unserializer(){
		let model = super.unserializer();
		model.type = +this.cardType;
		model.storeIds = this.storeIds;
		model.sellType = this.sellType;
		model.holderStatus = this.holderStatus;
		if(this.payRules){
			model.payRules = [];
			this.payRules.forEach((item:PayRule)=>{
				let rules:any[] = item.unserializer();
				if(rules){
					rules.forEach((ruleItem:any)=>{
						model.payRules.push(ruleItem);
					});
				}
			});
		}
		model.cardIntro = this.description;
		delete model.description;
		return model;
	}

	get storeIds(){
		let storeIds = '';
		if(this.storeList){
			let stores:{id:number}[] = [];
			this.storeList.forEach((item:any)=>{
				stores.push(item.id);
			});
			storeIds = stores.join(',');
		}
		return storeIds;
	}
}

//折扣卡
export class CardDiscountModel extends CardBaseModel{
	constructor(id?:number){
		super(CardType.DISCOUNT,id);
	}

	serializer(model:any,userService?:UserService){
		super.serializer(model,userService);
		return this;
	}
}

//储值卡
export class CardCashModel extends CardBaseModel{
	balance:number;
	deposit:number;
	constructor(id?:number){
		super(CardType.CASH,id);
	}

	getCardMoney(unpay:number,balance:number){
		if(this.balance){
			if(this.balance > unpay){
				return unpay;
			}else{
				return this.balance;
			}
		}else{
			return 0;
		}
	}

	serializer(model:any,userService?:UserService){
		super.serializer(model,userService);
		this.balance = MoneyTool.point2yuan(model.balance);
		this.deposit = MoneyTool.point2yuan(model.deposit);
		return this;
	}
}

//时段卡
export class CardTimeModel extends CardBaseModel{
	constructor(id?:number){
		super(CardType.TIME,id);
	}

	serializer(model:any,userService?:UserService){
		super.serializer(model,userService);
		return this;
	}
}

//疗程总次卡
export class CardTimesTotalModel extends CardBaseModel{
	balance:number;
	constructor(id?:number){
		super(CardType.TIMES_TOTAL,id);
	}

	serializer(model:any,userService?:UserService){
		super.serializer(model,userService);
		this.balance = model.balance;
		return this;
	}
}

//疗程分次卡
export class CardTimesModel extends CardBaseModel{
	constructor(id?:number){
		super(CardType.TIMES,id);
	}

	serializer(model:any,userService?:UserService){
		super.serializer(model,userService);
		return this;
	}
}