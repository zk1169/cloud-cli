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

@Component({
    selector: 'mw-order-detail',
    templateUrl: './mw-order-detail.component.html',
    styleUrls: ['./mw-order-detail.component.scss']
})
export class MwOrderDetailComponent {
    @Input() order:OrderModel;

    constructor() {
        
    }
}
