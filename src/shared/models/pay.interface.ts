import { PayType,DiscountType } from './mw.enum';

export interface IPay{
	id:number;

	//支付方式编码
	code:PayType;

	parentCode:PayType;

	//支付方式名称
	name:string;

	//是否有支付详情说明
	hasTip:boolean;

	//优惠类型
	discountType:DiscountType;

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

	//icon图标css类名
	iconClassName:string;

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
	checkPay(option:{itemId:number,itemCategory:string,storeId:number,canUseDiscountRule?:boolean}):void;
}