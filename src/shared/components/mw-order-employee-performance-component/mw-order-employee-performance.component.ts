import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnChanges,
    Output,
    EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseComponent } from '../../models/base.component';
import { OrderModel } from '../../models/order.model';
import { OrderItemModel } from '../../models/order-item.model';
import { UserService } from '../../services/user.service';
import { EventBus } from '../../services/eventbus.service';
import { MwLoadingBarService } from '../../services/mw-loading-bar.service';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeModel,EmployeePerformanceModel } from '../../models/employee.model';
import { AppointType } from '../../models/mw.enum';

@Component({
    selector: 'mw-order-employee-performance',
    templateUrl: './mw-order-employee-performance.component.html',
    styleUrls: ['./mw-order-employee-performance.component.scss']
})
export class MwOrderEmployeePerformanceComponent extends BaseComponent {
    @Input() order:OrderModel;
    private loading:Observable<Object>;
    private employeeSource:EmployeeModel[];
    private AppointTypeEnum:any = AppointType;

    constructor(
        userService:UserService,
        private employeeService:EmployeeService,
        eventBus: EventBus,
        slimLoader: MwLoadingBarService
    ) {
        super(slimLoader, eventBus);
    }

    ngOnInit(){
        this.loading = this.employeeService.searchList(null,1,200,this.order.store.id)
            .map(
                (res:any)=>{
                    if(res){
                        this.employeeSource = res.rows;
                    }
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

    addEmployeeClick(item:OrderItemModel){
        if(!item.employeeList){
            item.employeeList = [];
        }
        item.employeeList.push(new EmployeePerformanceModel());
    }
    removeEmployeeItem(item:OrderItemModel,index:number){
        item.employeeList.splice(index,1);
    }
}
