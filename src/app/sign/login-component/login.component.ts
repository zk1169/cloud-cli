import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

import { 
    AuthService,
    UserService,
    AuthModel,
    OrderStatus,
    EventBus,
    MerchantType,
    BaseComponent,
    MwLoadingBarService
} from '../../../shared/index';

@Component({
    selector: 'mw-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {
    model = new AuthModel("", "", true);
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router,
        eventBus: EventBus,
        slimLoader: MwLoadingBarService
        ) {
        super(slimLoader, eventBus)
    }

    login() {
        this.startSlimLoader();
        this.authService.login(this.model).subscribe(
            (res) => {
                if (this.userService.isLoggedIn) {
                    let empId:number = +res;
                    this.getPermission(empId);
                } else {
                    this.completeSlimLoader();
                }
            },
            (error) => {
                this.completeSlimLoader();
                this.eventNotice("alert.message", error);
            }
        );
    }

    getPermission(empId: number) {
        this.authService.getPermission(empId).subscribe(
            (res) => {
                this.completeSlimLoader();
                if (this.userService.isLoggedIn) {
                    if(this.userService.redirectUrl){
                        this.router.navigate([this.userService.redirectUrl]);
                    }else{
                        switch(this.userService.empInfo.merchant.merchantType){
                            case MerchantType.PROFESSIONAL:
                                this.router.navigate(['/dashboard-pro/order-list/'+OrderStatus.UNPAID]);
                                break;
                            case MerchantType.LITE:
                                this.router.navigate(['/dashboard-lite/order-list/'+OrderStatus.UNPAID]);
                                break;
                        }
                        
                    }
                }
            },
            (error) => {
                this.completeSlimLoader();
                this.eventNotice("alert.message", error);
            }
        );
    }

    logout() {
        this.authService.logout();
    }
}
