import { Component,ViewContainerRef } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { 
    HttpService,
    UserService,
    AuthService,
    EventBus,
    OrderStatus,
    EmployeeModel,
    SweetAlertService,
    MwLoadingBarService
} from '../../shared/index';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
    	ToasterService,
        SweetAlertService
    ]
})
export class AppComponent {
    toasterConfig: ToasterConfig =
        new ToasterConfig({
            showCloseButton: false,
            tapToDismiss: true,
            timeout: 3000
        });
    private viewContainerRef: ViewContainerRef;

    constructor(
        private toasterService: ToasterService,
        private slimLoader: MwLoadingBarService,
        private eventBus: EventBus,
        private authService: AuthService,
        private userService: UserService,
        private router: Router,
        viewContainerRef:ViewContainerRef
    ) {
        // You need this small hack in order to catch application root view container ref
        this.viewContainerRef = viewContainerRef;
        
        //debugger;
        //this.handleRouteChanged();
        this.handleAlertMessage();
        this.getEmployeeInfo();
    }

    private getEmployeeInfo() {
        try{
            this.userService.empInfo = new EmployeeModel().serializer(JSON.parse(window.localStorage.getItem("emp_info")));
        }catch(e){
            this.userService.isLoggedIn = false;
            return;
        }
        
        if (this.userService.empInfo) {
            this.userService.isLoggedIn = true;
        } else {
            this.userService.isLoggedIn = false;
        }
    }

    private handleRouteChanged() {
        //router events
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                //this.slimLoader.progress = 30;
                this.slimLoader.start();
            } else if (event instanceof NavigationEnd) {
                this.slimLoader.complete();
            } else if (event instanceof NavigationError) {
                this.slimLoader.stop();
            } else {
                this.slimLoader.complete();
            }
        });
    }

    private handleAlertMessage() {
        this.eventBus.subscribe('alert.message', (message: any) => {
            console.log(JSON.stringify(message));
            let toasterBody: string = "";
            let messageType = typeof(message);
            let toasterType = "info";
            switch (messageType) {
                case "string":
                    toasterBody = message;
                    break;
                case "object":
                    if (message.message) {
                        toasterType = "warning";
                        toasterBody = message.message;
                    } else if (message.statusText) {
                        //message.status
                        toasterType = "error";
                        toasterBody = message.statusText;
                    } else {
                        toasterType = "error";
                        toasterBody = "未知错误";
                    }
                    if (message.stack) {
                        console.error(message.stack);
                    }
                    break;
            }

            this.toasterService.pop(toasterType, 'Title', toasterBody);
        });
        //alert event subscribe
        // this.eventBus.subscribe('alert.warn', (message: string) => {
        //      this.toasterService.pop('success', 'success', message);
        //      this.toasterService.pop('warning', 'warning', message);
        //      this.toasterService.pop('info', 'info', message);
        //      this.toasterService.pop('error', 'error', message);
        // });
    }
}
