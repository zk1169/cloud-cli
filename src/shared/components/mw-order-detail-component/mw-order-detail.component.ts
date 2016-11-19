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
import { UserService } from '../../services/user.service';

@Component({
    selector: 'mw-order-detail',
    templateUrl: './mw-order-detail.component.html',
    styleUrls: ['./mw-order-detail.component.scss']
})
export class MwOrderDetailComponent {
    @Input() order:OrderModel;
    private empName:string;

    constructor(userService:UserService) {
        this.empName = userService.empInfo.name;
    }
}
