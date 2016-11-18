import { Component,ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { 
    EventBus,
    OrderStatus,
    AuthService,
    UserService,
    AuthGuard,
    MwLoaderService,
    EmployeeModel,
    FloatDialogModel,
    IDialog
  } from '../../../shared/index';
  import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
    selector: 'mw-dashboard-lite',
    templateUrl: './dashboard-lite.component.html',
    styleUrls: ['./dashboard-lite.component.scss'],
    providers: [ MwLoaderService ]
})
export class DashboardLiteComponent {
    private OrderStatusEnum = OrderStatus;
    private sideMenuState: string = "small";
    private empInfo:EmployeeModel;
    private selectItemFloat: FloatDialogModel;
    private selectPayItemFloat: FloatDialogModel;
    private parentComponent:IDialog;//弹出窗口父组件

    @ViewChild('mwModal') mwModal:ModalDirective;

    constructor(
        private eventBus: EventBus,
        private loader: MwLoaderService,
        private router: Router,
        private authService: AuthService,
        private userService: UserService
    ) {
        //this.loadImages();
        this.empInfo = userService.empInfo;
        //menu select subscribe
        // this.eventBus.subscribe('menu.select', (menuName: string) => {
        //     this.selectedMenu = menuName;
        // });
        //this.getPermission();
        this.subscribeWindow();
    }

    public ngAfterViewInit(): void {
        // hide spinner once all loaders are completed
        // MwLoaderService.loadAll().then((values) => {
        //     this.loader.hide();
        // });
    }

    public loginOut(){
        this.authService.logout();
        this.router.navigate(["/sign/login"]);
    }

    private getPermission() {
        this.authService.getPermission().subscribe(
            (res) => {},
            (error) => {
                //this.slimLoader.complete();
                this.eventBus.notifyDataChanged("alert.message", error);
            }
        );
    }

    private loadImages(): void {
        // register some loaders
        MwLoaderService.registerLoader(this.loader.load('assets/images/avatar01.png'));
    }

    private subscribeWindow() {
        this.eventBus.subscribe('show.selectItem', (message: FloatDialogModel) => {
            this.selectItemFloat = message;
        });
        this.eventBus.subscribe('show.selectPayItem', (message: FloatDialogModel) => {
            this.selectPayItemFloat = message;
        });
        this.eventBus.subscribe('show.modal', (message: IDialog) => {
            this.parentComponent = message;
            this.mwModal.show();
        });
    }

    private hideModal(ev:any){
        this.parentComponent = null;
        this.mwModal.hide();
    }
}
