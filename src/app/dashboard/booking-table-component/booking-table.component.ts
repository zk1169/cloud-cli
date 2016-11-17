import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
//import { Moment } from 'moment';
import { 
    UserService,
    AuthService,
    EventBus,
    TableEmployeeModel,
    StoreModel,
    AppointOrderService,
    MwLoadingBarService
} from '../../../shared/index';

@Component({
    selector: 'mw-booking-table',
    templateUrl: './booking-table.component.html',
    styleUrls: ['./booking-table.component.scss'],
    providers: [DatePipe, AppointOrderService]
})
export class BookingTableComponent{
    sideBarCollapse: boolean = false;
    tableEmployeeList: TableEmployeeModel[] = [];

    private sub: any;
    private slideBoxIsOpen: boolean = false;
    private view: string = 'day';
    private date: Date;
    private storeList: StoreModel[] = [];
    private storeId:number = 1270823666535335;

    constructor(
        private eventBus: EventBus,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private slimLoader: MwLoadingBarService,
        private authService: AuthService,
        private appointOrderService: AppointOrderService,
        private userService: UserService
        //private sweetAlert: SweetAlertService
    ) {

    }

    ngOnInit() {
        this.storeList = this.userService.storeMwSelectList;
        this.sub = this.activatedRoute.params.subscribe(params => {
            //this.orderType = +params['type']; // (+) converts string 'id' to a number
            this.tableEmployeeList = [];
            let dt = new Date(Date.parse(params['date']))
            if (dt && dt.getTime() > 0) {
                this.date = dt;
            }else{
                this.date = new Date();
            }
            this.getAppointOrder(this.storeId);
            // this.authService.getStoreList()
            //     .subscribe(
            //         (res) => {
            //             this.storeList = res;
            //             let dt = new Date(Date.parse(params['date']))
            //             if (dt && dt.getTime() > 0) {
            //                 this.date = dt;
            //             }else{
            //                 this.date = new Date();
            //             }
            //             this.getAppointOrder(this.storeId);
            //             //this.slimLoader.complete();
            //         },
            //         (error) => {
            //             this.eventBus.notifyDataChanged("alert.message", error);
            //             this.slimLoader.complete();
            //         }
            //     );

        });
        this.eventBus.notifyDataChanged("menu.select", "booking-table");
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    btnClick() {
        debugger;
        this.sideBarCollapse = !this.sideBarCollapse;
        //this.sweetAlert.alert('cc');
    }

    increment() {
        this.date = moment(this.date).add(1, 'day').toDate();
        //this.getAppointOrder(this.storeId);
        this.navigate(this.date);
    }

    decrement() {
        this.date = moment(this.date).subtract(1, 'day').toDate();
        //this.getAppointOrder(this.storeId);
        this.navigate(this.date);
    }

    dateOnChange(ev:Date){
        this.date = ev;
        //this.getAppointOrder(this.storeId);
        this.navigate(this.date);
    }

    private navigate(dt:Date){
        let navigationExtras: any = { date: moment(dt).format("YYYY-MM-DD") };
        this.router.navigate([this.userService.firstRoute + "booking-table" , navigationExtras]);
    }
    // today() {
    //     this.date = new Date();
    // }

    // dayClicked({ date, events }: { date: Moment, events: CalendarEvent[] }) {
    //     if (moment(date).startOf('month').isSame(moment(this.date).startOf('month'))) {
    //         if ((this.date.getTime() === date.toDate().getTime() && this.slideBoxIsOpen === true) || events.length === 0) {
    //             this.slideBoxIsOpen = false;
    //         } else {
    //             this.slideBoxIsOpen = true;
    //             this.date = date.toDate();
    //         }
    //     }
    // }

    private getAppointOrder(storeId: number) {
        this.slimLoader.start();
        var startTime = moment(this.date).format("YYYY-MM-DD") + " 00:00:00";
        var endTime = moment(this.date).add(1, 'days').format("YYYY-MM-DD") + " 00:00:00";
        this.appointOrderService.getAppointOrderTableList(startTime, endTime, storeId)
            .subscribe(
                (res) => {
                    this.tableEmployeeList = res;
                    this.slimLoader.complete();
                },
                (error) => {
                    this.eventBus.notifyDataChanged("alert.message", error);
                    this.slimLoader.complete();
                }
            );
    }

}
