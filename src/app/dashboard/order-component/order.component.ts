import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';
import {
    BaseComponent,
    EventBus,
    UserService,
    AuthService,
    MemberService,
    OrderService,
    MwAutocompleteComponent,
    OrderModel,
    OrderItemModel,
    IFloat,
    FloatDialogModel,
    CashPayModel,
    PosPayModel,
    OrderType,
    MwTool,
    StoreModel,
    MwLoadingBarService,
    SweetAlertService,
    MwCurrencyPipe,
    PayType,
    MemberType
} from '../../../shared/index';

@Component({
    selector: 'mw-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent extends BaseComponent implements OnInit, OnDestroy, IFloat {

    @ViewChild(MwAutocompleteComponent) autocompleteComponent: MwAutocompleteComponent;
    @ViewChild('modal') modal: ModalDirective;

    private sub: any;
    private order: OrderModel;//订单Model
    private memberSource: any[];//会员搜索结果集
    private memberType: { value: MemberType };//会员类型 散客或会员
    private memberTypeEnum: any = MemberType;
    private orderTypeEnum: any = OrderType;
    private el: HTMLElement;
    private sideBarState: string = 'show';
    private saveAysn: Observable<Object>;
    //所有会员类型
    private memberTypeList: { name: string, value: MemberType }[] = [
        { name: "散客消费", value: MemberType.IDLE_MEMBER },
        { name: "会员消费", value: MemberType.MEMBER }
    ];
    private storeList: StoreModel[];
    private roomList: any[];
    private dialogName: string;


    constructor(
        private route: ActivatedRoute,
        private memberService: MemberService,
        private orderService: OrderService,
        private userService: UserService,
        private sweetAlert: SweetAlertService,
        el: ElementRef,
        eventBus: EventBus,
        slimLoader: MwLoadingBarService
    ) {
        super(slimLoader, eventBus);
        this.el = el.nativeElement;
        this.memberSource = Observable.create((observer: any) => {
            memberService.getMemberList(this.autocompleteComponent.getSearchText(), 1, 7)
                .subscribe((result: any) => {
                    observer.next(result.rows);
                });
        });

    }

    get getContentWidth() {
        if (this.sideBarState == 'show') {
            return this.el.clientWidth - 210 - 40;
        } else {
            return this.el.clientWidth - 40;
        }
    }

    ngOnInit() {
        this.storeList = this.userService.storeMwSelectList;
        this.roomList = this.userService.roomList;
        this.route.data.forEach((data: any) => {
            if (data && data[0]) {
                this.order = data[0];
                if (this.order.member && this.order.member.id > 0) {
                    this.memberType = { value: MemberType.MEMBER };
                } else {
                    this.memberType = { value: MemberType.IDLE_MEMBER };
                }
            } else {
                this.order = new OrderModel();
                if (this.storeList && this.storeList.length > 0) {
                    this.order.store = this.storeList[0];
                }
                this.memberType = { value: MemberType.MEMBER };
            }
        });
        this.sub = this.route.params.subscribe(params => {
            // //debugger;
            // this.order.orderType = <OrderType>(+params['type']); // (+) converts string 'id' to a number
        });
    }

    memberOnSelected(member: any) {
        let cacheKey = MwTool.format(this.userService.HTTP_CACHE_GET_ALL_PAY_ITEM, this.order.store.id);
        this.userService.clearCacheByKey(cacheKey);
    }
    addMemberClick() {
        //this.showDialog("show.modal",this,"create-member-dialog");
        this.dialogName = 'create-member';
        this.modal.show();
    }

    cashBtnClick() {
        //let cashPay = new CashPayModel();
        this.order.addPayItem(PayType.CASH);
    }
    posBtnClick() {
        //let posPay = new PosPayModel();
        this.order.addPayItem(PayType.POS);
    }

    saveClick() {
        //this.saveAysn = Observable.of(true).delay(5000);
        this.startSlimLoader();
        this.saveAysn = this.orderService.saveOrder(this.order)
            .map(
            (res) => {
                this.completeSlimLoader();
                this.eventNotice("alert.message", "保存成功.");
                return true;
            },
            (error: any) => {
                this.eventNotice("alert.message", error);
                this.completeSlimLoader();
                return Observable.throw(error);
            }
            )
            .catch((error: any) => {
                this.eventNotice("alert.message", error);
                this.completeSlimLoader();
                return Observable.throw(error);
            });
    }

    payClick() {
        if (this.order.unPayMoney > 0) {
            let currencyPipe = new MwCurrencyPipe();
            var self = this;
            this.sweetAlert.confirm(
                {
                    text: "亲~您还有 " + currencyPipe.transform(this.order.unPayMoney) + " 元没有结算",
                    confirmButtonText: '直接减免',
                    cancelButtonText: '返回收银'
                }
            ).then(
                function (answer) {
                    if (answer) {
                        self.cashBtnClick();
                        self.dialogName = 'order-confirm';
                        self.modal.show();
                    } else {

                    }
                }
                );
            return;
        } else {
            this.dialogName = 'order-confirm';
            this.modal.show();
        }
    }

    //删除一个消费项目
    removeItem(id: number) {
        this.order.removeItemById(id);
    }

    //打开选择项目悬浮层
    showSelectItem(ev: any) {
        if (!this.order.store || !this.order.store.id) {
            this.eventNotice("alert.message", '请选择门店');
            return;
        }
        let element: any;
        if (ev.target.tagName == "I") {
            element = ev.target.parentElement;
        } else {
            element = ev.target;
        }
        this.eventNotice("show.selectItem", new FloatDialogModel(this, element, { storeId: this.order.store.id, memberId: this.order.member.id }));
    }
    //选中一个消费项目
    floatOKClick(item: any) {
        this.order.itemList.push(item);
    }

    hideModal(answer?: any) {
        this.dialogName = null;
        this.modal.hide();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private trackByItem(index: number, item: any) {
        return item.id;
    }
}
