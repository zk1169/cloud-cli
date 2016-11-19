 import { BaseModel } from './base.model';
 import { PayType } from './mw.enum';
 import { MoneyTool } from './money-tool.model'; 
 import { MwTool } from './mw-tool.model';
 import { CardBaseModel } from './card.model';
 import { MemberModel } from './member.model';

export interface IPay{
	id:number;

	//支付方式编码
	code:PayType;

	parentCode:PayType;

	//支付方式名称
	name:string;

	//是否有支付详情说明
	hasTip:boolean;

	//折扣金额
	discountMoney:number;

	//支付金额
	payMoney:number;

	//抵消总价
	totalPayMoney:number;

	//支付次数
	payTimes:number;

	//能否支付
	payFlag:boolean;

	//不能支付的原因
	noInfo:string;

	//付的是金额or次数
	moneyOrTimes:string;

	//支付的金额或次数
	payAmount:number;

	//支付方式信息
	getPayInfo(storeId:number):string;

	//获取支付方式的id
	getPayModelId():number;

	//更新余额
	updateBalance(payMoney:number):void;

	//设置折扣金额
	setDiscountMoney(unpay:number,itemId:number,storeId:number,usePayRule?:boolean):void;

	//检查能否支付
	checkPay(option:{itemId:number,itemCategory:string,storeId:number}):void;
}

export class BasePayModel extends BaseModel{
	name:string;
	code:PayType;
	parentCode:PayType;
	payLevel:number;
	present:boolean;

	payMoney:number;
	discountMoney:number;
	payTimes:number;
	payFlag:boolean;
	noInfo:string;

	constructor(id?:number){
		super(id);
		this.discountMoney = 0;
	}
	
	get hasTip():boolean{
		return false;
	}
	get moneyOrTimes():string{
		return "money";
	}

	get payAmount():number{
		return this.payMoney;
	}

	// get payMoney():number{
	// 	return this.discountMoney || 0;
	// }
	// set payMoney(value:number){
	// 	this.discountMoney = value;
	// }
	get totalPayMoney():number{
		return this.payMoney;
	}

	getPayInfo(storeId:number):string{
		return this.name;
	}
	checkPay(option:{itemId:number,itemCategory:string,storeId:number}):void{
		this.payFlag = true;
	}

	updateBalance(payMoney:number):void{

	}
	setDiscountMoney(unpay:number,itemId:number,storeId:number,usePayRule?:boolean):void{
		this.payMoney = unpay||0;
	}
	getPayModelId():number{
		return 0;
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
		this.code = PayType.CASH;
		this.name = "现金";
		this.payLevel = 70;
	}
	
	serializer(model:any){
		super.serializer(model);
		return this;
	}

	unserializer(){
		let model = super.unserializer();
		model.payMoney = MoneyTool.yuan2point(this.totalPayMoney);
		return model;
	}
}

export class PosPayModel extends CashPayModel implements IPay{
	constructor(id?:number){
		super(id);
		this.code = PayType.POS;
		this.name = "POS";
		this.payLevel = 70;
	}
}

export class CardPayModel extends BasePayModel implements IPay {
	balance:number;
	//type:number;
	kind:number;
	cardMoney:number;
	cardModel:CardBaseModel;

	constructor(id?:number){
		super(id);
		this.code = PayType.CARD;
	}

	get hasTip():boolean{
		return true;
	}
	get payMoney(){
		return this.cardMoney;
	}
	set payMoney(value:number){
		this.cardMoney = value;
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

	get totalPayMoney():number{
		return this.discountMoney + this.cardMoney;
	}
	getPayInfo(storeId:number):string{
		if(this.cardModel){
			let pInfo:string = this.cardModel.getPayInfo(storeId);
			if(pInfo){
				return this.name + '('+pInfo+')';
			}else{
				return this.name;
			}
		}else{
			return this.name;
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
	setDiscountMoney(unpay:number,itemId:number,storeId:number,usePayRule?:boolean){
		if(!this.cardModel){
			return 0;
		}
		if(usePayRule){
			this.discountMoney = this.cardModel.getDiscountMoney(unpay,itemId,storeId);
		}else{
			this.discountMoney = unpay;
		}
		unpay = MoneyTool.sub(unpay,this.discountMoney);
		this.cardMoney = this.cardModel.getCardMoney(unpay);
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
		this.code = PayType.WALLET;
		this.name = "钱包";
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

	serializer(model:any){
		super.serializer(model);
		this.memberModel = new MemberModel(model.memberId,MoneyTool.point2yuan(model.balance));
		this.balance = this.memberModel.balance;
		return this;
	}
}
