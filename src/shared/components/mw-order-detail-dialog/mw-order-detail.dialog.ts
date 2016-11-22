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

@Component({
    selector: 'mw-order-detail-dialog',
    templateUrl: './mw-order-detail.dialog.html',
    styleUrls: ['./mw-order-detail.dialog.scss']
})
export class MwOrderDetailDialog extends BaseComponent {
    @Input() orderId:number;
    @Output('onHide') hideEvent:EventEmitter<Object> = new EventEmitter();
    private loading:Observable<Object>;
    private order:OrderModel;

    constructor(private orderService:OrderService,slimLoader:MwLoadingBarService,eventBus: EventBus) {
        super(slimLoader,eventBus);
    }

    ngOnInit(){
        this.loading = this.orderService.getOrder(this.orderId)
            .map(
                (res:OrderModel)=>{
                    this.order = res;
                    return true;
                },
                (err:any)=>{Observable.throw(err)}
            );
    }

    hide(){
        this.hideEvent.emit();
    }
}
