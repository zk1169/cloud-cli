import { ISerializer } from './base.model';
import { PersonModel } from './person.model';
import { GenderType } from '../models/mw.enum';
import { MemberType } from '../models/member.enum';
//import { environment } from '../index';

export class MemberModel extends PersonModel implements ISerializer {
    memberNo: string;
    type:MemberType;
    balance:number;//钱包余额

    //constructor(id: number);
    constructor(id?: number,balance?:number, memberNo?: string, name?: string, mobile?: string) {
        super(id);
        if (id) {
            this.memberNo = memberNo;
            this.name = name;
            this.mobile = mobile;
            this.balance = balance;
        }
        // else{
        //     this.id = -1;
        //     this.name = "散客";
        //     this.type = MemberType.IDLE_MEMBER;
        // }
    }

    serializer(model:any){
        model.id = model.id || model.memberId;
        super.serializer(model);
        if(model.id){
        	this.memberNo = model.memberNo;
            this.type = MemberType.MEMBER;
        }else if(model.type){
            this.type = MemberType.PROSPECTIVE_MEMBER;
        }else{
        	//散客
        	this.id = -1;
        	this.name = "散客";
            this.type = MemberType.IDLE_MEMBER;
        }
        return this;
    }

    unserializer(){
        let model = super.unserializer();

        model.memberId = this.id;
        model.memberNo = this.memberNo;
        model.memberName = this.name;
        model.memberMobile = this.mobile;
        model.memberType = this.type;
        return model;
    }
}
