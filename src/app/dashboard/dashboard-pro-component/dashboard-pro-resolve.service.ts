import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService, OrderService, OrderModel,EventBus,UserService } from '../../../shared/index';

@Injectable()
export class DashboardProResolve implements Resolve < any > {
    constructor(private userService:UserService,private authService: AuthService, private router: Router,private eventBus: EventBus) {}

    resolve(route: ActivatedRouteSnapshot): Observable < any > | Promise < any > | any {
        return this.authService.getPermission(this.userService.empInfo.id).catch((error:any)=>{
                    //debugger;
                    //return Observable.throw(error);
                    this.eventBus.notifyDataChanged('alert.message', "获取商户权限失败");
                    return Observable.of(null);
                });
    }
}
