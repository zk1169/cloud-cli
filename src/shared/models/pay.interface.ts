 import { BaseModel } from './base.model';
 import { PayType } from './mw.enum';
 import { MoneyTool } from './money-tool.model'; 
 import { CardBaseModel } from './card.model';
 import { MemberModel } from './member.model';

export interface IPay{
	id:number;

	//支付方式编码
	code:PayType;

	parentCode:PayType;

	//支付方式名称
	name:string;

	//实付款
	discountMoney:number;

	//支付次数
	//payTimes:number;

	//能否支付
	payFlag:boolean;

	//不能支付的原因
	noInfo:string;

	//付的是金额or次数
	moneyOrTimes:string;

	//支付的金额或次数
	payAmount:number;

	//获取支付方式的id
	getPayModelId():number;

	//更新余额
	updateBalance(payMoney:number):void;

	//设置折后金额
	setDiscountMoney(unpay:number,itemId:number):void;

	//检查能否支付
	checkPay(option:{itemId:number,itemCategory:string,storeId:number}):void;

	//抵消总价
	getPayMoney():number;

	
}

export class BasePayModel extends BaseModel{
	name:string;
	code:PayType;
	parentCode:PayType;
	payLevel:number;
	present:boolean;

	discountMoney:number;
	payTimes:number;
	payFlag:boolean;
	noInfo:string;

	constructor(id?:number){
		super(id);
	}

	checkPay(option:{itemId:number,itemCategory:string,storeId:number}){
		this.payFlag = true;
	}

	updateBalance(payMoney:number){

	}
	setDiscountMoney(unpay:number,itemId:number){
		this.discountMoney = unpay||0;
	}
	getPayModelId(){
		return 0;
	}
	get moneyOrTimes(){
		return "money";
	}

	get payAmount(){
		return this.discountMoney;
	}

	static serializer(model:any){
		model.code = model.code || model.payCode || model.payType;
		model.name = model.name || model.payMethodName || model.paymentName;
		let payModel:IPay;
		let payType:PayType = <PayType>model.code;
		// let parentPayType:PayType = <PayType>model.parentCode;
		// switch(parentPayType){
			
		// }
		switch(payType){
			case PayType.CARD:
				payModel = new CardPayModel().serializer(model);
				break;
			case PayType.WALLET:
				payModel = new WalletPayModel().serializer(model);
				break;
			// case PayType.ACTIVITY:
			// 	break;
			// case PayType.FREE:
			// 	break;
			// case PayType.DEBT:
			// 	break;
			// case PayType.REDUCE:
			// 	break;
			case PayType.CASH:
			case PayType.POS:
			case PayType.WECHAT:
			case PayType.GROUP:
			case PayType.ALIPAY:
			default:
				payModel = new CashPayModel().serializer(model);
				break;
		}
		return payModel;
	}

	serializer(model:any){
		super.serializer(0);
		this.code = <PayType>model.code;
		this.parentCode = <PayType>model.parentCode;
		this.name = model.name;
		this.payLevel = model.payLevel;
		this.present = model.present;
		this.discountMoney = MoneyTool.point2yuan(model.payMoney);
	}

	unserializer(){
        let model = super.unserializer();
        model.paymentName = this.name;
        model.payType = this.code;
        model.present = this.present;
        model.payLevel = this.payLevel;
        return model;
    }
}

export class CashPayModel extends BasePayModel implements IPay {
	constructor(id?:number){
		super(id);
		this.code = 10;
		this.name = "现金";
		this.payLevel = 70;
	}
	
	getPayMoney(){
		return this.discountMoney || 0;
	}
	serializer(model:any){
		super.serializer(model);
		return this;
	}

	unserializer(){
		let model = super.unserializer();
		model.payMoney = MoneyTool.yuan2point(this.getPayMoney());
		return model;
	}
}

export class CardPayModel extends BasePayModel implements IPay {
	balance:number;
	//type:number;
	kind:number;
	cardModel:CardBaseModel;

	constructor(id?:number){
		super(id);
		this.code = 30;
	}
	get moneyOrTimes(){
		if(this.cardModel){
			return this.cardModel.moneyOrTimes;
		}else{
			return "money";
		}
	}
	get payAmount(){
		if(this.cardModel){
			let amount:number = 0;
			switch(this.moneyOrTimes){
				case "money":
					amount = this.discountMoney;
					break;
				case "times":
					amount = this.payTimes;
					break;
			}
			return amount;
		}else{
			return 0;
		}
	}
	get moreInfo(){
		if(this.cardModel && this.cardModel.useRule && this.cardModel.useRule.storeRuleList && this.cardModel.useRule.storeRuleList.length > 0){
			return true;
		}else{
			return false;
		}
	}

	getPayModelId(){
		if(this.cardModel){
			return this.cardModel.id;
		}else{
			return 0;
		}
	}
	updateBalance(payMoney:number){
		this.balance -= payMoney||0;
	}
	setDiscountMoney(unpay:number,itemId:number){
		this.discountMoney = unpay||0;
	}
	checkPay(option:{itemId:number,itemCategory:string,storeId:number}){
		if(this.cardModel){
			let checkResult = this.cardModel.checkPay(option);
			if(checkResult){
				this.payFlag = checkResult.payFlag;
				this.noInfo = checkResult.noInfo;
			}
		}else{
			this.payFlag = false;
			this.noInfo = '不能支付';
		}
	}
	getPayMoney(){
		return this.discountMoney || 0;
	}
	serializer(model:any){
		super.serializer(model);
		this.balance = MoneyTool.point2yuan(model.balance);
		//this.type = model.type;
		this.kind = model.kind;
		model.id = model.payMethodId;
		this.cardModel = CardBaseModel.serializer(model);
		return this;
	}
}

export class WalletPayModel extends BasePayModel implements IPay{
	balance:number;
	memberModel:MemberModel;
	constructor(id?:number){
		super(id);
		this.code = 31;
	}
	getPayModelId(){
		if(this.memberModel){
			return this.memberModel.id;
		}else{
			return 0;
		}
	}
	updateBalance(payMoney:number){
		this.balance -= payMoney||0;
	}
	getPayMoney(){
		return this.discountMoney || 0;
	}
	serializer(model:any){
		super.serializer(model);
		this.memberModel = new MemberModel(model.memberId,MoneyTool.point2yuan(model.balance));
		this.balance = this.memberModel.balance;
		return this;
	}
}
