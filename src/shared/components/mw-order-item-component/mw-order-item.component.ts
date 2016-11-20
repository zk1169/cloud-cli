import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnChanges,
    Output,
    EventEmitter
} from '@angular/core';
import { OrderModel } from '../../models/order.model';
import { OrderItemModel } from '../../models/order-item.model';
import { BaseComponent } from '../../models/base.component';
import { EventBus } from '../../services/eventbus.service';
import { FloatDialogModel ,IFloat} from '../../models/float-dialog.model';
import { IPay } from '../../models/pay.interface';

@Component({
    selector: 'mw-order-item',
    templateUrl: './mw-order-item.component.html',
    styleUrls: ['./mw-order-item.component.scss']
})
export class MwOrderItemComponent extends BaseComponent implements IFloat {
    @Input() order:OrderModel;
    @Input() orderItem:OrderItemModel;
    @Input() memberId:number;
    @Output() removeSelfEvent:EventEmitter<Object> = new EventEmitter();

    constructor(eventBus: EventBus) {
        super(null,eventBus);
    }
    addMorePayItem(ev:any){
        this.eventNotice("show.selectPayItem",new FloatDialogModel(this,ev.target,{order:this.order,orderItem:this.orderItem,memberId:this.memberId}));
    }
    addEmployeeClick(ev:any){
        this.eventNotice("show.selectEmployee",new FloatDialogModel(this,ev.target,{storeId:this.order.store.id,employeeList:this.orderItem.employeeList}));
    }
    //选中一个支付方式
    floatOKClick(answer:any,floatName:string){
        switch(floatName){
            case 'selectEmployee':
                this.orderItem.employeeList = answer;
                break;
            case 'selectPayItem':
                let canUseDiscountRule:boolean = this.orderItem.canUseDiscountRule(answer);
                answer.setDiscountMoney(this.orderItem.unPayMoney,this.orderItem.itemModel.id,this.order.store.id,canUseDiscountRule);
                this.orderItem.payList.push(answer);
                break;
        }
        
    }
    removePayItem(index:number){
        this.orderItem.payList.splice(index,1);
    }
    removeSelf(){
        this.removeSelfEvent.emit(this.orderItem.id);
    }
}
