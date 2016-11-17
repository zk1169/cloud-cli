import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService, OrderService, OrderModel } from '../../../shared/index';

@Injectable()
export class OrderListResolve implements Resolve < any > {
    constructor(private orderService: OrderService, private authService: AuthService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable < any > | Promise < any > | any {
        // let orderType = +route.params['type'];
        // let currentPage = 1;
        // let promise = this.orderService.getOrderList(this.authService.empInfo.mchId, this.authService.empInfo.storeId, orderType, currentPage, 10)
        // promise.subscribe(
        //     (res) => {
        //         res.currentPage = currentPage;
        //         res.orderType = orderType;
        //         return res;
        //     },
        //     (error) => {
        //         //this.eventBus.notifyDataChanged("alert.message", error);
        //     }
        // );
        // return promise;
    }
}
