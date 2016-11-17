import { Component, OnInit ,OnDestroy, trigger, state, style, transition, animate,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { 
    PaginationBaseComponent,
    OrderService,
    UserService,
    EventBus,
    OrderModel,
    GenderType,
    DialogService,
    CanComponentDeactivate,
    MerchantType,
    SweetAlertService,
    QueryTagModel,
    MwLoadingBarService
  } from '../../../shared/index';
import { OrderType, OrderSource, OrderStatus } from '../../../shared/index';

@Component({
    selector: 'mw-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
    animations: [
        trigger('sideBarState', [
            state('collapse', style({
                width: "0px"
            })),
            state('show', style({
                width: '210px'
            })),
            transition('collapse => show', animate('200ms')),
            transition('show => collapse', animate('200ms'))
        ])
    ]
})
export class OrderListComponent extends PaginationBaseComponent implements OnInit, OnDestroy, CanComponentDeactivate {
    private sub: any;
    private GenderTypeEnum = GenderType;
    private OrderTypeEnum = OrderType;
    //private OrderSourceEnum = OrderSource;
    //private OrderStatusEnum = OrderStatus;
    private orderType: number;
    private sideBarState: string = 'show';
    private searchText: string;
    private queryStoreId:number;
    private merchantType:MerchantType;
    private MerchantTypeEnum = MerchantType;
    private storeList:QueryTagModel[];
    private routerList:{routerLink:string,routerName:string}[];

    constructor(
        private orderService: OrderService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private dialogService: DialogService,
        private sweetAlert: SweetAlertService,
        eventBus: EventBus,
        slimLoader: MwLoadingBarService
    ) {
        super(slimLoader, eventBus);
        this.merchantType = this.userService.merchantType;
        this.initRouterLink();
        //this.merchantType = MerchantType.LITE;
        this.storeList = this.userService.storeQueryTagList;
        this.storeList[0].selected = true;
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.orderType = +params['type']; // (+) converts string 'id' to a number
            this.searchText = params['keyword'];
            this.queryStoreId = +params['store'];
            let page = +params['page'];
            if (!page) {
                page = 1;
            }
            this.getList(page, this.searchText,this.queryStoreId);
        });
    }
    // ngAfterViewInit(){
    // }

    get firstRoute(){
        return this.userService.firstRoute;
    }
    btnClick() {
        this.sweetAlert.alert({text:"cc"});
        this.eventNotice("alert.message", "button clicked");
        //this.currentPage = 3;
    }
    doSearch(event: any) {
        console.log('searchText:' + event.searchText);
        //this.getList(this.currentPage, event.searchText);
        this.navigate(1,event.searchText,this.queryStoreId);
    }

    pageChanged(event: any): void {
        console.log('Page changed to: ' + event.page);
        //console.log('Number items per page: ' + event.itemsPerPage);
        this.navigate(event.page,this.searchText,this.queryStoreId);
    };

    storeChanged(event:any){
        console.log("storeChanged,length="+event.length);
        this.navigate(1,this.searchText,event.value);
    }

    private navigate(page:number,searchText ? : string,storeId?:number){
        let navigationExtras: any = { page: page };
        if (searchText && searchText.length > 0) {
            navigationExtras.keyword = searchText;
        }
        if(storeId && storeId>0){
            navigationExtras.store = storeId;
        }
        this.router.navigate([this.userService.firstRoute + "order-list/" + this.orderType, navigationExtras]);
    }

    private getList(page: number, searchText ? : string,storeId?:number) {
        this.startSlimLoader();
        //this.clearPagination();
        this.orderService.getOrderList(this.userService.empInfo.merchant.id, storeId, < OrderStatus > this.orderType, searchText, page, this.itemsPerPage)
            .subscribe(
                (res) => {
                    this.setPagination(page, res.totalItems, res.rows);
                    this.completeSlimLoader();
                },
                (error) => {
                    this.eventNotice("alert.message", error);
                    this.completeSlimLoader();
                }
            );
    }

    private initRouterLink(){
        this.routerList = [];
        switch(this.merchantType){
            case MerchantType.PROFESSIONAL:
                this.routerList.push({routerLink:this.userService.firstRoute+'order-list/'+OrderStatus.UNPAID,routerName:'待付款'});
                this.routerList.push({routerLink:this.userService.firstRoute+'order-list/'+OrderStatus.PAID,routerName:'已付款'});
                this.routerList.push({routerLink:this.userService.firstRoute+'order-list/'+OrderStatus.PAID_LEFT,routerName:'尾款单'});
                this.routerList.push({routerLink:this.userService.firstRoute+'order-list/'+OrderStatus.HISTORY,routerName:'历史订单'});
                break;
            case MerchantType.LITE:
                this.routerList.push({routerLink:this.userService.firstRoute+'order-list/'+OrderStatus.UNPAID,routerName:'待付款'});
                this.routerList.push({routerLink:this.userService.firstRoute+'order-list/'+OrderStatus.PAID,routerName:'已付款'});
                break;
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    canDeactivate(): Observable < boolean > | Promise < boolean > | boolean {
        return true;
        //return this.dialogService.confirm('Discard changes?');
    }
}
