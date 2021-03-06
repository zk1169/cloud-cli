import { ISerializer } from './base.model';
import { PersonModel } from './person.model';
import { StoreModel } from './store.model';
import { MerchantModel,MerchantRoleModel,OrganizationModel } from './merchant.model';
import { GenderType,MerchantType,AppointType } from './mw.enum';
import { EmployeeService } from '../services/employee.service';
import { MoneyTool } from './money-tool.model';
import { Observable } from 'rxjs/Observable';

export class EmployeeModel extends PersonModel implements ISerializer{
	birthday:string;
	code:string;
	merchant:MerchantModel;
	merchantRole:MerchantRoleModel;
	organization:OrganizationModel;
	store:StoreModel;

	constructor(id?:number,name?:string){
		super(id);
		this.name = name;
	}

	get text(){
		return this.name;
	}
	set text(value:string){
		this.name = value;
	}

	get storeId(){
		if(this.store){
			return this.store.id;
		}else{
			return null;
			//return 1270823666535335;
		}
	}

    get merchantType():MerchantType{
        if(this.merchant){
            return this.merchant.merchantType;
        }else{
            return MerchantType.PROFESSIONAL;
        }
    }

	serializer(model:any){
		super.serializer(model);
		this.code = model.code;
		if(model.merchant){
			this.merchant = new MerchantModel().serializer(model.merchant);
		}
		if(model.store){
			this.store = new StoreModel().serializer(model.store);
		}
		if(model.merchantRole){
			this.merchantRole = new MerchantRoleModel().serializer(model.merchantRole);
		}
		if(model.organization){
			this.organization = new OrganizationModel().serializer(model.organization);
		}
		return this;
	}
	unserializer(){
		let model = super.unserializer();
		model.employeeId = this.id;
		model.employeeName = this.name;
		return model;
	}
}

export class EmployeePerformanceModel{
	private _appoint:AppointType;
	performance:number;//业绩
	cardMoney:number;//卡扣
	commission:number;//提成
	employee:EmployeeModel;

	constructor(){
		this.employee = new EmployeeModel();
		this.appoint = AppointType.TIME;
	}
	get appoint(){
		return this._appoint;
	}
	set appoint(value:any){
		this._appoint = <AppointType>(+value);
	}
	serializer(model:any){
		this.employee = new EmployeeModel().serializer(model);
		this.appoint = model.isAppoint;
		if(model.orderEmployeePerformances && model.orderEmployeePerformances.length>0){
			this.appoint = model.orderEmployeePerformances[0].isAppoint;
			this.cardMoney = MoneyTool.point2yuan(model.orderEmployeePerformances[0].cardConsumeTotalAmount);
			this.commission = MoneyTool.point2yuan(model.orderEmployeePerformances[0].commissionAmount);
			this.performance = MoneyTool.point2yuan(model.orderEmployeePerformances[0].achievementTotalAmount);
		}
		return this;
	}
	unserializer(){
		let model = this.employee.unserializer();
		model.orderEmployeePerformances = [{
			employeeId:this.employee.id,
			employeeName:this.employee.name,
			isAppoint:this.appoint,
			cardConsumeTotalAmount:MoneyTool.yuan2point(this.cardMoney),
			achievementTotalAmount:MoneyTool.yuan2point(this.performance),
			commissionAmount:MoneyTool.yuan2point(this.commission)
		}];
		return model;
	}
}