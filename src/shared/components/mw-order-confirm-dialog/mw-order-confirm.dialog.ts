import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnChanges,
    Output,
    EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { OrderModel } from '../../models/order.model';
import { BaseComponent } from '../../models/base.component';
import { EventBus } from '../../services/eventbus.service';
import { MwLoadingBarService } from '../../services/mw-loading-bar.service';
import { OrderService } from '../../services/order.service';
import { SweetAlertService } from '../../services/sweet-alert.service';

@Component({
    selector: 'mw-order-confirm-dialog',
    templateUrl: './mw-order-confirm.dialog.html',
    styleUrls: ['./mw-order-confirm.dialog.scss']
})
export class MwOrderConfirmDialog extends BaseComponent {
    @Input() order:OrderModel;
    @Output('onHide') hideEvent:EventEmitter<Object> = new EventEmitter();
    private step:number;
    private saveAysn:Observable<Object>;

    constructor(
        private orderService: OrderService,
        private sweetAlert: SweetAlertService,
        slimLoader:MwLoadingBarService,
        eventBus: EventBus
    ) {
        super(slimLoader,eventBus);
        this.step = 1;
    }

    ngOnInit(){
        
    }
    previewClick(){
        this.step--;
    }
    nextClick(){
        this.step++;
    }
    OKClick(){
        this.startSlimLoader();
        this.saveAysn = this.orderService.payOrder(this.order)
            .map(
                (res) => {
                    var self = this;
                    this.completeSlimLoader();
                    this.sweetAlert.success({title:'订单收银成功.'})
                        .then(function(){
                            self.hideEvent.emit();
                        });
                    //this.eventNotice("alert.message", "收银成功.");
                    //this.hideEvent.emit();
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
    hide(){
        this.hideEvent.emit();
    }
}
