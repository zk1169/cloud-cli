import {
    Component,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
    OnInit,
    OnChanges,
    OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FormBaseComponent } from '../../models/base.component';
import { MwFormComponent } from '../mw-form-component/mw-form.component';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';
import { EventBus } from '../../services/eventbus.service';
import { BaseForm,TextboxForm,TextareaForm,DropdownForm,RadioForm,MwSelectForm } from '../../models/base-form.model';
import { MwStatus } from '../../models/mw.enum';
import { ServiceItemService } from '../../services/service-item.service';
import { ServiceItemModel } from '../../models/service-item.model';
import { MwLoadingBarService } from '../../services/mw-loading-bar.service';

@Component({
    selector: 'mw-edit-service-item-dialog',
    templateUrl: './mw-edit-service-item.dialog.html',
    styleUrls: ['./mw-edit-service-item.dialog.scss']
})
export class MwEditServiceItemDialog extends FormBaseComponent implements OnInit,OnChanges,OnDestroy {
    @Input() editServiceItem:ServiceItemModel;
    @Output('onHide') hideEvent:EventEmitter<Object> = new EventEmitter();
    @ViewChild(MwFormComponent) mwForm:MwFormComponent;

    constructor(
      private commonService:CommonService,
      private userService:UserService,
      private serviceItemService:ServiceItemService,
      eventBus: EventBus,
      slimLoader: MwLoadingBarService
    ) {
        super(slimLoader, eventBus);
    }

    ngOnInit(){
      this.formList = this.initFormItems();
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes) {
          if (changes['editServiceItem']) {
              this.formList = this.initFormItems();
          }
      }
    }

    OKClick(answer:any){
      debugger
      if(this.mwForm.form.valid){
        this.getFormValue();
        this.startSlimLoader();
        this.serviceItemService.save(this.editServiceItem)
          .subscribe(
              (res) => {
                  this.hideEvent.emit(this.editServiceItem);
                  this.completeSlimLoader();
              },
              (error) => {
                  this.eventNotice("alert.message", error);
                  this.completeSlimLoader();
              }
          );
      }else{
        this.mwForm.onSubmit();
      }
    }

    hide(){
        this.hideEvent.emit();
    }

    getFormValue(){
      if(!this.editServiceItem){
        this.editServiceItem = new ServiceItemModel();
      }
      this.mwForm.items.forEach((item:any,index:number)=>{
        this.editServiceItem[item.key] = item.getValue();
      });
    }

    initFormItems() {
      let items: BaseForm<any>[] = [
        new TextboxForm({
          key: 'name',
          label: '项目名称',
          value: '',
          required: true,
          minlength:2,
          placeholder:'项目名称',
          order: 1,
          defaultValue:this.editServiceItem?this.editServiceItem.name:null
        }),
        new MwSelectForm({
          key: 'storeList',
          label: '所属门店',
          options: this.userService.storeMwSelectList,
          multiple:true,
          required: true,
          order: 2,
          defaultValue:this.editServiceItem?this.editServiceItem.storeList:null
        }),
        new TextboxForm({
          key: 'price',
          label: '项目售价',
          type: 'number',
          placeholder:'项目售价',
          required: true,
          order: 3,
          addon:'¥',
          defaultValue:this.editServiceItem?this.editServiceItem.price:null
        }),
        new TextboxForm({
          key: 'serviceDuration',
          label: '项目时长',
          type: 'number',
          placeholder:'项目时长',
          required: true,
          order: 4,
          addon:'分钟',
          defaultValue:this.editServiceItem?this.editServiceItem.serviceDuration:null
        }),
        new TextboxForm({
          key: 'code',
          label: '项目编号',
          type: 'number',
          placeholder:'项目编号',
          order: 5,
          defaultValue:this.editServiceItem?this.editServiceItem.code:null
        }),
        new RadioForm({
          key: 'acceptBooking',
          label: '手机端可预约',
          options: [
            {value: MwStatus.AVAILABLE,  name: '可以'},
            {value: MwStatus.UNAVAILABLE,  name: '不可以'}
          ],
          order: 6,
          defaultValue:this.editServiceItem?{value:this.editServiceItem.acceptBooking}:{value: MwStatus.AVAILABLE}
        }),
        // new TextboxForm({
        //   key: 'price2',
        //   label: '项目体验价',
        //   type: 'number',
        //   placeholder:'项目体验价',
        //   order: 6,
        //   addon:'¥',
        // }),
        new DropdownForm({
          key: 'status',
          label: '项目状态',
          options: [
            {value: MwStatus.AVAILABLE,  name: '在售'},
            {value: MwStatus.UNAVAILABLE,  name: '停售'}
          ],
          order: 7,
          defaultValue:this.editServiceItem?this.editServiceItem.status:null
        }),
        new TextareaForm({
          key: 'description',
          label: '项目描述',
          type: 'text',
          placeholder:'项目描述',
          order: 8
        })
      ];
      return items.sort((a, b) => a.order - b.order);
    }

    ngOnDestroy() {

    }

}    
