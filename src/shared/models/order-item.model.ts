import { BaseModel,ISerializer,IFilter } from './base.model';
import { OrderItemType,DiscountType } from './mw.enum';
import { ItemBaseModel } from './item-base.model';
import { ServiceItemModel } from './service-item.model';
import { EmployeePerformanceModel } from './employee.model'; 
import { IPay,CashPayModel,BasePayModel } from './pay.interface';
import { MoneyTool } from './money-tool.model';

export class OrderItemModel extends BaseModel implements ISerializer,IFilter {
	itemType:OrderItemType;
	employeeList:EmployeePerformanceModel[];
	payList:IPay[];
	count:number;
	itemModel:ItemBaseModel;

	private _totalMoney: number;

	constructor(id?:number){
		super(id);
		this.payList = [];
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

	//折后金额
	get discountMoney():number{
		let _discountMoney = 0;
		if(this.payList && this.payList.length > 0){
			this.payList.forEach((item:IPay,index:number)=>{
				if(item.code){
					_discountMoney += item.discountMoney;
				}
			});
		}
		return MoneyTool.sub(this.totalMoney , _discountMoney);
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

	//能否能再次使用折扣优惠
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

	addPayItem(payItem:IPay){
		if(this.unPayMoney > 0){
            //let cashPay = new CashPayModel();
            payItem.payMoney = this.unPayMoney;
            this.payList.push(payItem);
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
					this.employeeList.push(new EmployeePerformanceModel().serializer(item));
				}
			});
		}
		if(model.orderItemPays && model.orderItemPays.length > 0){
			this.payList = [];
			model.orderItemPays.forEach((item:any,index:number)=>{
				if(item){
					this.payList.push(BasePayModel.serializer(item));
				}
			});
		}
		return this;
	}

	unserializer(){
        let model = super.unserializer();
        //delete model.id;
        model.amount = this.count;
        if(this.payList && this.payList.length > 0){
        	model.orderItemPays = [];
        	this.payList.forEach((item:any,index:number)=>{
        		if(item && item.code){
        			model.orderItemPays.push(item.unserializer());
        		}
        	})
        }
        return model;
    }
}