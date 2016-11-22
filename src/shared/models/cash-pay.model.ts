 import { BaseModel } from './base.model';
 import { PayType } from './mw.enum';
 import { MoneyTool } from './money-tool.model';
 import { MemberModel } from './member.model';
 import { DiscountType } from './mw.enum';
 import { IPay } from './pay.interface';

export class BasePayModel extends BaseModel implements IPay{
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
		
	get iconClassName(){
		return 'icon-xianjinzhifu';
	}

	get hasTip():boolean{
		return false;
	}
	get discountType():DiscountType{
		return DiscountType.NONE; 
	}
	get moneyOrTimes():string{
		return "money";
	}

	get payAmount():number{
		return this.payMoney;
	}

	get totalPayMoney():number{
		return this.payMoney;
	}

	getPayInfo(storeId:number):string{
		return this.name;
	}
	checkPay(option:{itemId:number,itemCategory:string,storeId:number,canUseDiscountRule:boolean}):void{
		this.payFlag = true;
	}

	updateBalance(payMoney:number):void{

	}
	setDiscountMoney(unpay:number,itemId:number,storeId:number,usePayRule?:boolean):void{
		this.payMoney = unpay||0;
		this.discountMoney = 0;
	}
	getPayModelId():number{
		return 0;
	}

	serializer(model:any){
		super.serializer(0);
		this.code = <PayType>model.code;
		this.parentCode = <PayType>model.parentCode;
		this.name = model.name;
		this.payLevel = model.payLevel;
		this.present = model.present;
		this.payMoney = MoneyTool.point2yuan(model.payMoney);
		this.discountMoney = 0;
	}

	unserializer(){
        let model = super.unserializer();
        model.paymentName = this.name;
        model.payType = this.code;
        model.present = this.present;
        //model.payLevel = this.payLevel;
        model.cardMoney = 0;
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

	get iconClassName(){
		return 'icon-xianjinzhifu';
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

	get iconClassName(){
		return 'icon-poszhifu';
	}

	serializer(model:any){
		super.serializer(model);
		return this;
	}

	unserializer(){
		return super.unserializer();
	}
}

export class WechatPayModel extends CashPayModel implements IPay{
	constructor(id?:number){
		super(id);
		this.code = PayType.WECHAT;
		this.name = "微信支付";
		this.payLevel = 70;
	}

	get iconClassName(){
		return 'icon-weixinhuodong';
	}

	serializer(model:any){
		super.serializer(model);
		return this;
	}

	unserializer(){
		return super.unserializer();
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
	get iconClassName(){
		return 'icon-qianbao';
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

	unserializer(){
		let model =  super.unserializer();
		return model;
	}
}