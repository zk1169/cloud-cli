import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService, OrderService, OrderModel,EventBus } from '../../../shared/index';

@Injectable()
export class OrderResolve implements Resolve < any > {
    constructor(private orderService: OrderService, private authService: AuthService, private router: Router,private eventBus: EventBus) {}

    resolve(route: ActivatedRouteSnapshot): Observable < any > | Promise < any > | any {
        let type = +route.params['type'];
        let id = +route.params['id'];
        let promise:Observable < any >;
        //type:1-id=订单id;2-预约单id;3-会员id,综合消费;4-会员id,开卡;
        switch(type){
            case 1:
                //promise = this.orderService.getOrder(id);
                promise = this.orderService.getOrder(id).catch((error:any)=>{
                    //debugger;
                    //return Observable.throw(error);
                    this.eventBus.notifyDataChanged('alert.message', "获取订单详情失败");
                    return Observable.of(null);
                });
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
        }
        return promise;
    }
}
