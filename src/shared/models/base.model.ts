import { UserService } from '../services/user.service';

export interface ISerializer{
    serializer(model:any,userService?:UserService):any;
    unserializer():any;
}
export interface IFilter{
    filter(filterText:string):boolean;
}
export class BaseModel implements ISerializer {
   id: number;
    constructor(id?:number) {
    	this.id = id;
    }
    serializer(id:number){
        this.id = id;
    }
    unserializer(){
    	let model:any ={
    		id:this.id
    	};
    	return model;
    }
}