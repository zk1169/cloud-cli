// Observable Version
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { UserService } from './user.service';
import { ServiceItemModel } from '../models/service-item.model';


@Injectable()
export class ServiceItemService {
    constructor(private httpService: HttpService,private userService: UserService) {}

    getList(storeId: number,keyword:string, page: number, size: number) {
        let data = {
            page: page,
            size: size,
            query: [
                { field: "merchantId", value: this.userService.empInfo.merchant.id+"" }
            ]
        };
        if(storeId){
            data.query.push({ field: "storeId", value: storeId+"" });
        }
        if(keyword){
            data.query.push({ field: "keyword", value: keyword });
        }

        return this.httpService.request('/api/serviceItem/search', 'post', data)
            .map((res) => {
                let result: any = {};
                result.rows = [];
                if (res) {
                    result.totalItems = res.total;
                    if (res.rows && res.rows.length > 0) {
                        for (let i in res.rows) {
                            if (res.rows[i]) {
                                let serviceItemModel:ServiceItemModel = new ServiceItemModel().serializer(res.rows[i]);
                                //serviceItemModel.store = this.userService.getStoreById(res.rows[i].storeId);
                                result.rows.push(serviceItemModel);
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

    save(model:ServiceItemModel){
        if(!model){
            return Observable.of(false);
        }
        let method:string;
        if(model.id && model.id > 0){
            method = "put";
        }else{
            method = "post";
        }
        return this.httpService.request('/api/serviceItem', method, model.unserializer())
            .map((res) => {
                return res;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }
}
