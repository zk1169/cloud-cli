import { ISerializer } from './base.model';
import { PersonModel } from './person.model';
import { StoreModel } from './store.model';
import { MerchantModel,MerchantRoleModel,OrganizationModel } from './merchant.model';
import { GenderType,MerchantType } from './mw.enum';
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

export class EmployeeSearchModel{
	searchText:string;
	employeeSource:any[];
	employeeModel:EmployeeModel;
	storeId:number;

	constructor(employeeModel:EmployeeModel,employeeService:EmployeeService,storeId:number){
		if(employeeModel){
			this.employeeModel = employeeModel;
		}else{
			this.employeeModel = new EmployeeModel();
		}
		// this.storeId = storeId;
		// this.employeeSource = Observable.create((observer: any) => {
  //           employeeService.searchList(this.searchText, 1, 7,this.storeId)
  //               .subscribe((result: any) => {
  //                   observer.next(result.rows);
  //               });
  //       });
	}

	get name(){
		if(this.employeeModel){
			return this.employeeModel.name;
		}else{
			return '';
		}
	}
	set name(value){
		this.searchText = value;
	}
}