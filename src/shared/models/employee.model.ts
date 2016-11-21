import { ISerializer } from './base.model';
import { PersonModel } from './person.model';
import { StoreModel } from './store.model';
import { MerchantModel,MerchantRoleModel,OrganizationModel } from './merchant.model';
import { GenderType,MerchantType,AppointType } from './mw.enum';
import { EmployeeService } from '../services/employee.service';
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
}

export class EmployeePerformanceModel extends EmployeeModel{
	private _appoint:AppointType;
	performance:number;//业绩
	buckle:number;//卡扣
	commission:number;//提成

	constructor(){
		super();
		this.appoint = AppointType.TIME;
	}
	get appoint(){
		return this._appoint;
	}
	set appoint(value:any){
		this._appoint = <AppointType>(+value);
	}
	serializer(model:any){
		super.serializer(model);
		return this;
	}
}