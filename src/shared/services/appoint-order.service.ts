// Observable Version
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { TableEmployeeModel } from '../models/table-employee.model';
import { UserService } from './user.service';


@Injectable()
export class AppointOrderService {
    constructor(private httpService: HttpService, private userService: UserService) {}

    getAppointOrderTableList(startTime:string, endTime:string, storeId:number) {
        let data :any= {
            employeeId: this.userService.empInfo.id,
            merchantId: this.userService.empInfo.merchant.id,
            startTime: startTime,
            endTime: endTime,
            storeId:storeId
        };
        // if(this.userService.empInfo.storeId){
        //     data.storeId = this.userService.empInfo.storeId;
        // }else if(this.userService.permissionStoreList && this.userService.permissionStoreList.length > 0){
        //     data.storeId = this.userService.permissionStoreList[0].id;
        // }

        return this.httpService.request('api/appointment/list', 'post', data)
            .map((res) => {
                let result: TableEmployeeModel[] = [];
                if (res.length > 0) {
                    for (let i in res) {
                        if (res[i]) {
                            result.push(new TableEmployeeModel().serializer(res[i]));
                        }
                    }
                }
                return result;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }
}
