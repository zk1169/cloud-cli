import { BaseModel,ISerializer } from './base.model';
import { GenderType,MerchantType } from './mw.enum';
//import { environment } from '../index';
import { environment } from '../../environments/environment';

export class MerchantModel extends BaseModel implements ISerializer {
    name: string;
    fullName: string;
    code:string;
    description:string;
    logoFileId: number;
    businessLicenseFileId:number;

    private _merchantType:number;

    constructor(id ? : number) {
        super(id);
    }

    get logoFilePath(): string {
        if (this.logoFileId && this.logoFileId > 0) {
            return environment.serverFilePath + this.logoFileId;;
        } else {
            return environment.localImageDefault;
        }
    }
    get businessLicenseFilePath(): string {
        if (this.businessLicenseFileId && this.businessLicenseFileId > 0) {
            return environment.serverFilePath + this.businessLicenseFileId;;
        } else {
            return environment.localImageDefault;
        }
    }

    get merchantType():MerchantType{
        if(this._merchantType){
            return <MerchantType>this._merchantType;
        }else{
            return MerchantType.PROFESSIONAL;
        }
    }

    serializer(model:any){
        super.serializer(model.id);
        this.name = model.name;
        this.fullName = model.fullName;
        this.logoFileId = model.logoFileId;
        this.businessLicenseFileId = model.businessLicenseFileId;
        this._merchantType = model.functionVersion;

        //为了测试方便，始终设置商户类型为简化版
        //this._merchantType = 2;
        return this;
    }
}

export class MerchantRoleModel extends BaseModel {
    name:string;
    code:string;

    constructor(id ? : number) {
        super(id);
    }

    serializer(model:any){
        super.serializer(model.id);
        this.name = model.name;
        this.code = model.code;
        return this;
    }
}

export class OrganizationModel extends BaseModel {
    name:string;

    constructor(id ? : number) {
        super(id);
    }

    serializer(model:any){
        super.serializer(model.id);
        this.name = model.name;
        return this;
    }
}
