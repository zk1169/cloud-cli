 import { BaseModel } from './base.model';
 import { PayType } from './mw.enum';
 import { MoneyTool } from './money-tool.model'; 
 import { CardBaseModel } from './card.model';
 import { DiscountType } from './mw.enum';
 import { BasePayModel } from './cash-pay.model';
 import { IPay } from './pay.interface';

export class CardPayModel extends BasePayModel implements IPay {
	balance:number;
	kind:number;
	cardMoney:number;
	cardModel:CardBaseModel;

	constructor(id?:number){
		super(id);
		this.code = PayType.CARD;
	}

	get discountType():DiscountType{
		if(this.cardModel){
			return this.cardModel.discountType;
		}else{
			return DiscountType.NONE; 
		}
	}
	get hasTip():boolean{
		return true;
	}
	get noInputMoney(){
		if(this.cardModel){
			return this.cardModel.noInputMoney;
		}else{
			return false;
		}
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
					amount = this.payMoney;
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


	get iconClassName(){
		let className = 'icon-xianjinzhifu';
		if(this.cardModel){
			className = this.cardModel.iconClassName;
		}
		if(this.hasRule && this.hasBalance){
			className += ' more-info-iheight';
		}
		return className;
	}

	get hasRule():boolean{
		if(this.cardModel && this.cardModel.useRule && this.cardModel.useRule.useStoreRule){
			return true;
		}else{
			return false;
		}
	}

	get hasBalance():boolean{
		return this.cardModel.hasBalance;
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
		//return this.id;
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
			this.discountMoney = 0;
		}
		unpay = MoneyTool.sub(unpay,this.discountMoney);
		this.cardMoney = this.cardModel.getCardMoney(unpay,this.balance);
	}
	checkPay(option:{itemId:number,itemCategory:string,storeId:number,canUseDiscountRule?:boolean}){
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
		if(this.payFlag && option.canUseDiscountRule == false){
			this.noInfo = '不能同时享有两个折扣优惠哦!';
		}
	}

	serializer(model:any){
		super.serializer(model);
		this.balance = MoneyTool.point2yuan(model.balance);
		this.kind = model.kind;
		//debugger
		if(!model.cardMoney){
			model.cardMoney = 0;
		}
		this.cardMoney = MoneyTool.point2yuan(model.cardMoney);
		this.discountMoney = MoneyTool.point2yuan(MoneyTool.sub(model.payMoney , model.cardMoney));

		model.id = model.payMethodId || model.paymentId;
		this.cardModel = CardBaseModel.serializer(model);
		return this;
	}
	unserializer(){
		let model = super.unserializer();
		model.paymentId = this.getPayModelId();
		if(model.id==0){
			delete model.id;
		}
		//model.amount = 0;
		model.cardMoney = MoneyTool.yuan2point(this.cardMoney);
		model.payMoney = MoneyTool.yuan2point(this.totalPayMoney);
		model.kind = this.kind;
		return model;
	}
}