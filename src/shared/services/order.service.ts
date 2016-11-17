// Observable Version
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { OrderModel } from '../models/order.model';
import { OrderStatus } from '../models/mw.enum';


@Injectable()
export class OrderService {
    constructor(private httpService: HttpService,private userService:UserService) {}

    getOrderList(mchId: number, storeId: number, orderStatus: OrderStatus,keyword:string, page: number, size: number) {
        let status: string;
        switch (orderStatus) {
            case OrderStatus.UNPAID:
                status = "1";
                break;
            case OrderStatus.PAID:
                status = "2";
                break;
            case OrderStatus.PAID_LEFT:
                status = "3";
                break;
            case OrderStatus.HISTORY:
                status = "4";
                break;
        }
        let data = {
            page: page,
            size: size,
            query: [
                { field: "status", value: status }
            ],
            sort: [
                { field: "lastUpdateDate", sort: "desc" }
            ]
        };
        if(mchId){
            data.query.push({ field: "merchantId", value: mchId+"" });
        }
        if(storeId){
            data.query.push({ field: "storeId", value: storeId+"" });
        }
        // else{
        //     data.query.push({ field: "storeId", value: "1202734702397426,1240323626310282,1270823666535335,1230823666551625" });
        // }
        if(keyword){
            data.query.push({ field: "keyword", value: keyword });
        }

        return this.httpService.request('/api/order/getList', 'post', data)
            .map((res) => {
                let result: any = {};
                result.rows = [];
                if (res) {
                    result.totalItems = res.total;
                    if (res.rows && res.rows.length > 0) {
                        for (let i in res.rows) {
                            if (res.rows[i]) {
                                result.rows.push(new OrderModel().serializer(res.rows[i]));
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

    getOrder(orderId:number){
        return this.httpService.request('api/order/'+orderId, 'get', null)
            .map((res) => {
                let orderModel:OrderModel = new OrderModel().serializer(res);
                orderModel.store = this.userService.getStoreById(res.storeId);
                return orderModel;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    saveOrder(mchId: number, orderModel:OrderModel) {
        // switch (vm.tab_index) {
        //     case 0: //综合开单收银
        //         if (cashier) {
        //             url = "api/order/pay";
        //         } else {
        //             url = "api/order";
        //         }
        //         break;
        //     case 1: //开卡收银
        //         if (cashier) {
        //             url = "api/order/payCardOrder";
        //         } else {
        //             url = "api/order/saveCardOrder";
        //         }
        //         break;
        //     case 2: //卡充值收银
        //         url = "api/order/payRechargeOrder";
        //         break;
        // }
        let data = orderModel.unserializer();
        //debugger;
        //return Observable.of(true).delay(1000);
        return this.httpService.request('api/order', 'post', data)
            .map((res) => {
                return res;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }
}
