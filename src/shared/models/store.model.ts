import { BaseModel,ISerializer } from './base.model';
import { MoneyTool } from './money-tool.model';
import { UserService } from '../services/user.service';

export class StoreModel extends BaseModel implements ISerializer {
    name:string;
    fullName:string;
    storeNo:string;
    openStartTime:string;
    openEndTime:string;
    appointStartTime:string;
    appointEndTime:string;

    constructor(id?: number,name?:string){
        super(id);
        this.name = name;
    }

    get text():string{
        return this.name;
    }
    set text(value:string){
        this.name = value;
    }

    serializer(model:any,userService?:UserService){
        super.serializer(model.id);
        if(model.name){
            this.name = model.name;
        }else if(userService){
            this.name = userService.getStoreNameById(this.id);
        }
        
        this.openStartTime = model.openTimeStart;
        this.openEndTime = model.openTimeEnd;
        this.appointStartTime = model.appoinmentTimeStart;
        this.appointEndTime = model.appoinmentTimeEnd;
        return this;
    } 
}

export class StorePriceModel extends StoreModel{
    price:number;

    constructor(id?: number){
        super(id);
    }

    serializer(model:any,userService?:UserService){
        super.serializer(model.store);
        this.price = MoneyTool.point2yuan(model.sellingPrice);
        return this;
    }
}
