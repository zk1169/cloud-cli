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
import { EventBus } from '../../services/eventbus.service';
import { UserService } from '../../services/user.service';
import { EmployeeService } from '../../services/employee.service';
import { MwLoadingBarService } from '../../services/mw-loading-bar.service';
import { EmployeeModel,EmployeePerformanceModel } from '../../models/employee.model';
import { AppointType } from '../../models/mw.enum';

let selecteEmployeeComponent :MwSelectEmployeeComponent;

@Component({
    selector: 'mw-select-employee',
    templateUrl: './mw-select-employee.component.html',
    styleUrls: ['./mw-select-employee.component.scss']
})
export class MwSelectEmployeeComponent extends BaseComponent implements OnDestroy {
    @Input() floatDialogModel:FloatDialogModel;

    private el: HTMLElement;
    private employeeList:EmployeePerformanceModel[];
    private employeeSource:EmployeeModel[];
    private loading:Observable<Object>;
    private AppointTypeEnum:any = AppointType;

    constructor(
        el: ElementRef, 
        private employeeService:EmployeeService,
        private userService:UserService,
        eventBus: EventBus,
        slimLoader: MwLoadingBarService
    ) {
        super(slimLoader, eventBus);
        this.el = el.nativeElement;
        selecteEmployeeComponent = this;
        window.document.addEventListener('click', this.documentClick, true);
    }

    ngOnInit(){
        this.employeeList = this.floatDialogModel.args.employeeList;
        if(!this.employeeList){
            this.employeeList = [];
        }
        if(this.employeeList.length==0){
            this.employeeList.push(new EmployeePerformanceModel());
        }
        this.loading = this.employeeService.searchList(null,1,200,this.floatDialogModel.args.storeId)
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
    addEmployeeClick(){
        if(!this.employeeList){
            this.employeeList = [];
        }
        this.employeeList.push(new EmployeePerformanceModel());
    }

    okClick(){
        this.floatDialogModel.parent.floatOKClick(this.employeeList,'selectEmployee');
        this.floatDialogModel.show = false;
    }
    cancelClick(){
        this.floatDialogModel.parent.floatOKClick(null);
        this.floatDialogModel.show = false;
    }
    documentClick(ev:any){
        if (selecteEmployeeComponent) {
            if (!selecteEmployeeComponent.el.contains(ev.target)) {
                selecteEmployeeComponent.floatDialogModel.show = false;
                selecteEmployeeComponent = null;
            }
        }
    }

    ngOnDestroy() {
        window.document.removeEventListener('click', this.documentClick, true);
        selecteEmployeeComponent = null;
    }

}    
