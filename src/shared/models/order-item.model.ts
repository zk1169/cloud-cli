import { BaseModel,ISerializer,IFilter } from './base.model';
import { OrderItemType,DiscountType,PayType } from './mw.enum';
import { ItemBaseModel } from './item-base.model';
import { ServiceItemModel } from './service-item.model';
import { EmployeePerformanceModel } from './employee.model'; 
import { IPay } from './pay.interface';
import { CashPayModel } from './cash-pay.model';
import { PayFactoryModel } from './pay-factory.model';
import { MoneyTool } from './money-tool.model';
import { MwTool } from './mw-tool.model';

export class OrderItemModel extends BaseModel implements ISerializer,IFilter {
	itemType:OrderItemType;
	employeeList:EmployeePerformanceModel[];
	payList:IPay[];
	count:number;
	itemModel:ItemBaseModel;//订单项目、产品、套餐、卡、充值
	overtime:boolean;//加钟
	overtimeId:string;//加钟checkbox的id

	private _totalMoney: number;

	constructor(id?:number){
		super(id);
		this.payList = [];
		this.overtimeId = new Date().getTime()+'_'+id;
	}

	get unPayMoney():number{
		let _unPayMoney = this.totalMoney;
		if(this.payList && this.payList.length > 0){
			this.payList.forEach((item:IPay,index:number)=>{
				if(item.code){
					_unPayMoney -= item.totalPayMoney;
				}
			});
		}
		return _unPayMoney;
	}

	/**
	 * 折扣或优惠金额
	 */
	get discountMoney():number{
		let _discountMoney = 0;
		if(this.payList && this.payList.length > 0){
			this.payList.forEach((item:IPay,index:number)=>{
				if(item.code){
					_discountMoney += item.discountMoney;
				}
			});
		}
		return _discountMoney;
		//return MoneyTool.sub(this.totalMoney , _discountMoney);
	}

	get payMoney():number{
		let _payMoney = 0;
		if(this.payList && this.payList.length > 0){
			this.payList.forEach((item:IPay,index:number)=>{
				if(item.code){
					_payMoney += item.payMoney;
				}
			});
		}
		return _payMoney;
	}

	get totalMoney():number{
		if(this._totalMoney && this._totalMoney>0){
			return this._totalMoney;
		}else{
			if(this.itemModel && this.count){
				return this.itemModel.price*this.count;
			}else{
				return 0;
			}
		}
	}

	set totalMoney(value :number){
		this._totalMoney = value;
	}

	get performance(){
		return 500;
	}
	get cardMoney(){
		return 888;
	}
	get hasEmployee(){
        let hasFlag:boolean = false;
        if(this.employeeList && this.employeeList.length > 0){
            hasFlag = true;
        }
        return hasFlag;
    }

	/**
	 * 能否能再次使用折扣优惠
	 */
	canUseDiscountRule(payItem:IPay){
		let useRule:boolean = true;
		if(this.payList){
			this.payList.forEach((item:IPay)=>{
				if(item.discountType == DiscountType.DISCOUNT){
					useRule = false;
				}
			});
		}
		return useRule;
	}

	addPayItem(payType:PayType){
		if(this.unPayMoney > 0){
            let payModel = PayFactoryModel.getModelByType(payType);
            payModel.payMoney = this.unPayMoney;
            this.payList.push(payModel);
        }
	}

	filter(filterText:string){
		return this.itemModel.name.indexOf(filterText)>-1;
	}

	serializer(model:any){
		super.serializer(model.id);
		switch(model.itemType){
			case "SERVICE_ITEM":
				this.itemModel = new ServiceItemModel().serializer(model);
				this.itemType = OrderItemType.SERVICE_ITEM;
				break;
			case "PRODUCT":
				break;
			case "SERVICE_PACKAGE":
				break;
		}

		// if(this.itemModel){
		// 	throw "订单itemModel为空";
		// 	return this;
		// }
		this.count = model.amount;
		//this.totalMoney = this.itemModel.price*this.count;
		if(model.orderEmployees && model.orderEmployees.length > 0){
			this.employeeList = [];
			// for(let i in model.orderEmployees){
			// 	let employee = new EmployeeModel();
			// 	employee.serializer(model.orderEmployees[i]);
			// 	this.employeeList.push(employee);
			// }
			model.orderEmployees.forEach((item:any,index:number)=>{
				if(item){
					item.id = item.employeeId;
					item.name = item.employeeName;
					this.employeeList.push(new EmployeePerformanceModel().serializer(item));
				}
			});
		}
		if(model.orderItemPays && model.orderItemPays.length > 0){
			this.payList = [];
			model.orderItemPays.forEach((item:any,index:number)=>{
				if(item){
					this.payList.push(PayFactoryModel.serializer(item));
				}
			});
		}
		return this;
	}

	unserializer(){
        let model = super.unserializer();
        if(this.itemModel){
        	let itemModel = this.itemModel.unserializer();
        	itemModel.originalPerPrice = itemModel.actualPerPrice = itemModel.price;
        	MwTool.assign(model,itemModel);
        }
        if(model.id == model.itemId){
        	delete model.id;
        }
        model.amount = this.count;
        model.unPayMoney = this.unPayMoney;
        if(this.payList && this.payList.length > 0){
        	model.orderItemPays = [];
        	this.payList.forEach((item:any,index:number)=>{
        		if(item && item.code){
        			model.orderItemPays.push(item.unserializer());
        		}
        	})
        }
        model.orderEmployees = [];
        if(this.employeeList && this.employeeList.length > 0){
        	this.employeeList.forEach((item:any,index:number)=>{
        		if(item && item.id){
        			model.orderEmployees.push(item.unserializer());
        		}
        	})
        }
        return model;
    }
}