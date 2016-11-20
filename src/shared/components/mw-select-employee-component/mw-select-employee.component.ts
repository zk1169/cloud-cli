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
import { EmployeeModel,EmployeeSearchModel } from '../../models/employee.model';

let selecteEmployeeComponent :MwSelectEmployeeComponent;

@Component({
    selector: 'mw-select-employee',
    templateUrl: './mw-select-employee.component.html',
    styleUrls: ['./mw-select-employee.component.scss']
})
export class MwSelectEmployeeComponent extends BaseComponent implements OnDestroy {
    @Input() floatDialogModel:FloatDialogModel;
    //@Output() itemSelectedEvent:EventEmitter<Object> = new EventEmitter();

    private el: HTMLElement;
    //private employeeList:EmployeeSearchModel[];
    private employeeList:EmployeeModel[];
    private employeeSource:EmployeeModel[];
    private loading:Observable<Object>;

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
        // this.employeeList = [];
        // if(this.floatDialogModel.args.employeeList && this.floatDialogModel.args.employeeList.length>0){
        //     this.floatDialogModel.args.employeeList.forEach((item:EmployeeModel)=>{
        //         let employeeSearch = new EmployeeSearchModel(item,this.employeeService,this.floatDialogModel.args.storeId);
        //         this.employeeList.push(employeeSearch);
        //     });
        // }else{
        //     this.employeeList.push(new EmployeeSearchModel(null,this.employeeService,this.floatDialogModel.args.storeId));
        // }

        this.employeeList = this.floatDialogModel.args.employeeList;
        if(!this.employeeList){
            this.employeeList = [];
        }
        if(this.employeeList.length==0){
            this.employeeList.push(new EmployeeModel());
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
        //this.employeeList.push(new EmployeeSearchModel(null,this.employeeService,this.floatDialogModel.args.storeId));
        this.employeeList.push(new EmployeeModel());
    }

    okClick(){
        this.floatDialogModel.parent.floatOKClick(null);
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
