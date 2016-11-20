// Observable Version
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { UserService } from './user.service';
import { EmployeeModel } from '../models/employee.model';


@Injectable()
export class EmployeeService {
    constructor(private httpService: HttpService,private userService: UserService) {}

    searchList(keyword:string, page: number, size: number,storeId:number) {
        let mchId = this.userService.empInfo.merchant.id+"";
        let data:any = {
            page: page,
            size: size,
            query: [
                { field: "merchantId", value: mchId+"" },
                { field: "positionStatus", value: "1", operation: "eq", dataType: "int" }
            ]
        };
        if(storeId){
            data.query.push({ field: "storeId", value: storeId+"" });
        }
        let cacheKey:string;
        if(keyword){
            data.query.push({ field: "keyword", value: keyword,operation: "like" });
        }else{
            cacheKey = this.userService.HTTP_CACHE_SEARCH_EMPLOYEE_FIRST;
        }

        return this.httpService.requestCache('/api/employee/search', 'post', data,cacheKey)
            .map((res) => {
                let result: any = {};
                result.rows = [];
                if (res) {
                    result.totalItems = res.total;
                    if (res.rows && res.rows.length > 0) {
                        for (let i in res.rows) {
                            if (res.rows[i]) {
                                result.rows.push(new EmployeeModel().serializer(res.rows[i]));
                            }
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
