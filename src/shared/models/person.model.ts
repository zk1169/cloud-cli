import { BaseModel,ISerializer } from './base.model';
import { GenderType } from './mw.enum';
//import { environment } from '../index';
import { environment } from '../../environments/environment';

export class PersonModel extends BaseModel implements ISerializer {
    name: string;
    mobile: string;
    avatarId: number;

    private _gender: number;

    constructor(id ? : number) {
        super(id);
    }

    get avatarPath(): string {
        if (this.avatarId && this.avatarId > 0) {
            return environment.serverFilePath + this.avatarId;
        } else {
            return environment.localAvatarDefault;
        }
    }

    get gender(): GenderType {
        if (!this._gender) {
            return GenderType.FEMALE;
        } else {
            return <GenderType > this._gender;
        }
    }

    serializer(model: any) {
        super.serializer(model.id);
        this.name = model.name || model.employeeName || model.memberName;
        this.mobile = model.mobile || model.memberMobile;
        this.avatarId = model.avatarId || model.avatarFileId;
        this._gender = +model.gender;
    }

    unserializer(){
        let model = super.unserializer();
        model.name = this.name;
        model.mobile = this.mobile;
        return model;
    }
}
