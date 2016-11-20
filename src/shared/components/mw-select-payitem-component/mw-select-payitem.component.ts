import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    OnInit,
    OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseComponent } from '../../models/base.component';
import { FloatDialogModel } from '../../models/float-dialog.model';
import { OrderItemModel } from '../../models/order-item.model';
import { TreeModel } from '../../models/tree.model';
import { EventBus } from '../../services/eventbus.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';
import { IPay } from '../../models/pay.interface';
import { MwTool } from '../../models/mw-tool.model';
import { PayType } from '../../models/mw.enum';
import { MemberModel } from '../../models/member.model';
import { MwLoadingBarService } from '../../services/mw-loading-bar.service';

let selectePayItemComponent :MwSelectPayItemComponent;

@Component({
    selector: 'mw-select-payitem',
    templateUrl: './mw-select-payitem.component.html',
    styleUrls: ['./mw-select-payitem.component.scss']
})
export class MwSelectPayItemComponent extends BaseComponent implements OnDestroy {
    @Input() floatDialogModel:FloatDialogModel;
    //@Output() itemSelectedEvent:EventEmitter<Object> = new EventEmitter();

    private el: HTMLElement;
    private loading:Observable<Object>;
    private itemList:any[];

    constructor(
        el: ElementRef, 
        private commonService:CommonService,
        private userService:UserService,
        eventBus: EventBus,
        slimLoader: MwLoadingBarService
    ) {
        super(slimLoader, eventBus);
        this.el = el.nativeElement;
        selectePayItemComponent = this;
        window.document.addEventListener('click', this.documentClick, true);
    }

    ngOnInit(){
        this.loading = this.commonService.getAllPayItem(this.userService.empInfo.merchant.id,this.floatDialogModel.args.order.store.id,this.floatDialogModel.args.memberId)
            .map(
                (res:IPay[])=>{
                    this.initTabItem(res);
                    return true;
                },
                (err:any)=>{
                    Observable.throw(err);
                }
            ).catch((error: any) => {
                this.eventNotice("alert.message",error);
                return Observable.throw(error);
            });
    }

    payItemClick(item:IPay){
        if(!item.payFlag){
            return;
        }
        if(this.floatDialogModel){
            //let cloneItem = MwTool.cloneDeep(item);
            this.floatDialogModel.parent.floatOKClick(item,'selectPayItem');
            this.floatDialogModel.show = false;
        }
    }
    documentClick(ev:any){
        if (selectePayItemComponent) {
            if (!selectePayItemComponent.el.contains(ev.target)) {
                selectePayItemComponent.floatDialogModel.show = false;
                selectePayItemComponent = null;
            }
        }
    }

    ngOnDestroy() {
        window.document.removeEventListener('click', this.documentClick, true);
        selectePayItemComponent = null;
    }

    private initTabItem(payList:IPay[]){
        this.itemList = [
            {name:"常用",subItemList:[]},
            {name:"第三方支付",subItemList:[]},
            {name:"会员卡",subItemList:[]},
            {name:"券",subItemList:[]},
            {name:"活动",subItemList:[]},
            {name:"赠品",subItemList:[]},
            {name:"团购",subItemList:[]}
        ];
        if(payList && payList.length > 0){
            payList.forEach((item:any,index:number)=>{
                switch(item.code){
                    case PayType.CARD:
                        this.itemList[2].subItemList.push(item);
                        break;
                    case PayType.ACTIVITY:
                        this.itemList[4].subItemList.push(item);
                        break;
                    case PayType.FREE:
                        this.itemList[5].subItemList.push(item);
                        break;
                    case PayType.GROUP:
                        this.itemList[6].subItemList.push(item);
                        break;
                    case PayType.REDUCE:
                    case PayType.DEBT:
                    case PayType.WALLET:
                    case PayType.CASH:
                    case PayType.POS:
                    case PayType.WECHAT:
                    case PayType.ALIPAY:
                    default:
                        this.itemList[0].subItemList.push(item);
                        break;
                }
            });
        }
        this.checkPay();
    }

    //1.计算余额; 2.检查能否支付
    private checkPay(){
        this.itemList.forEach((item:any)=>{
            if(item && item.subItemList){
                item.subItemList.forEach((subItem:IPay)=>{

                    //计算余额
                    if(subItem.getPayModelId() > 0){
                        let payAmount :number = this.floatDialogModel.args.order.getPayById(subItem.getPayModelId());
                        subItem.updateBalance(payAmount);
                    }
                    
                    //能否使用折扣优惠
                    let canUseDiscountRule:boolean
                    if(subItem.code == PayType.CARD || subItem.code == PayType.ACTIVITY || subItem.code == PayType.FREE){
                        canUseDiscountRule = this.floatDialogModel.args.orderItem.canUseDiscountRule(subItem);
                    }
                    //检查能否支付
                    subItem.checkPay(
                        {
                            itemId:this.floatDialogModel.args.orderItem.itemModel.id,
                            itemCategory:this.floatDialogModel.args.orderItem.itemModel.categoryLevel,
                            storeId:this.floatDialogModel.args.storeId,
                            canUseDiscountRule:canUseDiscountRule
                        }
                    );
                })
            }
        });
    }
}    
