import { Component, OnInit,OnDestroy,ViewChild,ElementRef } from '@angular/core';
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
    MwLoadingBarService
} from '../../../shared/index';

@Component({
    selector: 'mw-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent extends BaseComponent implements OnInit,OnDestroy,IFloat {

    @ViewChild(MwAutocompleteComponent) autocompleteComponent: MwAutocompleteComponent;
    @ViewChild('modal') modal:ModalDirective;

    private sub: any;
    private order:OrderModel;//订单Model
    private memberSource: any[];//会员搜索结果集
    private memberType: any;//会员类型 散客或会员
    private el: HTMLElement;
    private sideBarState:string = 'show';
    private saveAysn:Observable<Object>;
    //所有会员类型
    private memberTypeList = [
        { name: "散客消费", value: 1 },
        { name: "会员消费", value: 2 }
    ];
    private storeList: StoreModel[];
    private roomList: any[];
    private dialogName:string;
    
    
    constructor(
        private route: ActivatedRoute,
        private memberService: MemberService,
        private orderService: OrderService,
        private userService: UserService,
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
    ngOnInit() {
        this.storeList = this.userService.storeMwSelectList;
        this.roomList = this.userService.roomList;
        this.route.data.forEach((data: any) => {
            if(data && data[0]){
                this.order = data[0];
                if(this.order.member && this.order.member.id>0){
                    this.memberType = {value: 2};
                }else{
                    this.memberType = {value: 1};
                }
            }else{
                this.order = new OrderModel();
                if(this.storeList && this.storeList.length > 0){
                    this.order.store = this.storeList[0];
                }
                this.memberType = {value: 2};
            }
        });
        this.sub = this.route.params.subscribe(params => {
            // //debugger;
            // this.order.orderType = <OrderType>(+params['type']); // (+) converts string 'id' to a number
            // this.authService.getStoreList()
            //     .subscribe(
            //         (res) => {
            //             this.storeList = res;
            //             //this.order.store = this.storeList[0];
            //         },
            //         (error) => {
            //             //this.storeList = [new StoreModel(1,"a"),new StoreModel(2,"b"),new StoreModel(3,"c")];
            //             //this.order.store = this.storeList[0];
            //             this.eventNotice("alert.message", error);
            //             //this.completeSlimLoader();
            //         }
            //     );
        });
    }

    memberOnSelected(member:any){
        let cacheKey = MwTool.format(this.userService.HTTP_CACHE_GET_ALL_PAY_ITEM,this.userService.empInfo.storeId);
        this.userService.clearCacheByKey(cacheKey);
    }
    addMemberClick(){
        //this.showDialog("show.modal",this,"create-member-dialog");
        this.dialogName = 'create-member';
        this.modal.show();
    }

    cashBtnClick(){
        let cashPay = new CashPayModel();
        this.order.addPayItem(cashPay);
    }
    posBtnClick(){
        let posPay = new PosPayModel();
        this.order.addPayItem(posPay);
    }

    hideModal(answer?:any){
        this.dialogName = null;
        this.modal.hide();
    }

    saveClick(){
        //this.saveAysn = Observable.of(true).delay(5000);
        this.startSlimLoader();
        this.saveAysn = this.orderService.saveOrder(this.userService.empInfo.merchant.id,this.order)
            .map(
                (res) => {
                    this.completeSlimLoader();
                    this.eventNotice("alert.message", "保存成功.");
                    return true;
                },
                (error:any) => {
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

    payClick(){
        this.dialogName = 'order-confirm';
        this.modal.show();
    }

    //删除一个消费项目
    removeItem(id:number){
        this.order.removeItemById(id);
    }

    //打开选择项目悬浮层
    showSelectItem(ev:any){
        if(!this.order.store || !this.order.store.id){
            this.eventNotice("alert.message",'请选择门店');
            return;
        }
        let element:any;
        if(ev.target.tagName == "I"){
            element = ev.target.parentElement;
        }else{
            element = ev.target;
        }
        this.eventNotice("show.selectItem",new FloatDialogModel(this,element,{storeId:this.order.store.id,memberId:this.order.member.id}));
    }
    //选中一个消费项目
    floatOKClick(item:any){
        this.order.itemList.push(item);
    }

    get getContentWidth(){
        if(this.sideBarState == 'show'){
            return this.el.clientWidth - 210 - 40;
        }else{
            return this.el.clientWidth - 40;
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private trackByItem(index:number,item:any) {
        return item.id;
    }
}
