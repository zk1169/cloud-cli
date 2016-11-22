 import { PayType } from './mw.enum';
 import { CardPayModel } from './card-pay.model';
 import { CashPayModel,PosPayModel,WechatPayModel,WalletPayModel } from './cash-pay.model';
 import { IPay } from './pay.interface';

export class PayFactoryModel{
	static getModelByType(type:PayType){
		let payModel:IPay;
		switch(type){
			case PayType.DEBT:
				break;
			case PayType.REDUCE:
				break;
			case PayType.POS:
				payModel = new PosPayModel();
				break;
			case PayType.WECHAT:
				payModel = new WechatPayModel();
				break;
			case PayType.GROUP:
			case PayType.ALIPAY:
			case PayType.CASH:
			default:
				payModel = new CashPayModel();
				break;
		}
		return payModel;
	}

	static serializer(model:any){
		model.code = model.code || model.payCode || model.payType;
		model.name = model.name || model.payMethodName || model.paymentName;
		let payModel:IPay;
		let payType:PayType = <PayType>+model.code;
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
			case PayType.POS:
				payModel = new PosPayModel().serializer(model);
				break;
			case PayType.WECHAT:
				payModel = new WechatPayModel().serializer(model);
				break;
			case PayType.GROUP:
			case PayType.ALIPAY:
			case PayType.CASH:
			default:
				payModel = new CashPayModel().serializer(model);
				break;
		}
		return payModel;
	}

}