import {
    Component,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FormBaseComponent } from '../../models/base.component';
import { MwFormComponent } from '../mw-form-component/mw-form.component';
import { IDialog } from '../../models/dialog.interface';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';
import { BaseForm,TextboxForm,DropdownForm } from '../../models/base-form.model';

@Component({
    selector: 'mw-create-member-dialog',
    templateUrl: './mw-create-member.dialog.html',
    styleUrls: ['./mw-create-member.dialog.scss']
})
export class MwCreateMemberDialog extends FormBaseComponent implements OnInit,OnDestroy {
    //@Input() parent:IDialog;
    @Output('onHide') hideEvent:EventEmitter<Object> = new EventEmitter();
    @ViewChild(MwFormComponent) mwForm:MwFormComponent;

    constructor(private commonService:CommonService,private userService:UserService) {
        super();
        this.formList = this.getQuestions();
    }

    ngOnInit(){
    }

    OKClick(answer:any){
        // if(this.parent){
        //     this.parent.dialogOKClick(answer);
        // }
        // let cc = this.mwForm.onSubmit();
        //debugger;
        this.hideEvent.emit();
    }

    hide(){
        this.hideEvent.emit();
    }

    ngOnDestroy() {

    }

    getQuestions() {
      let questions: BaseForm<any>[] = [
        new DropdownForm({
          key: 'source',
          label: '渠道来源',
          options: [
            {value: '1', name: '大众点评'},
            {value: '2', name: '美团团购'},
            {value: '3', name: '百度糯米'},
            {value: '4', name: '微信活动'},
            {value: '5', name: '上门客人'}
          ],
          required: true,
          order: 3
        }),
        new TextboxForm({
          key: 'name',
          label: '姓名',
          value: '',
          required: true,
          minlength:5,
          placeholder:'姓名',
          order: 1,
        }),
        new TextboxForm({
          key: 'mobile',
          label: '手机号',
          type: 'email',
          placeholder:'手机号',
          required: true,
          order: 2
        })
      ];
      return questions.sort((a, b) => a.order - b.order);
    }

}    
