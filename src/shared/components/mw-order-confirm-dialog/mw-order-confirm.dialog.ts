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
import { MwLoadingBarService } from '../../services/mw-loading-bar.service';
import { IPay } from '../../models/pay.interface';

@Component({
    selector: 'mw-order-confirm-dialog',
    templateUrl: './mw-order-confirm.dialog.html',
    styleUrls: ['./mw-order-confirm.dialog.scss']
})
export class MwOrderConfirmDialog extends BaseComponent {
    @Input() order:OrderModel;
    @Output('onHide') hideEvent:EventEmitter<Object> = new EventEmitter();

    constructor(slimLoader:MwLoadingBarService,eventBus: EventBus) {
        super(slimLoader,eventBus);
    }

    ngOnInit(){
        
    }

    hide(){
        this.hideEvent.emit();
    }
}
