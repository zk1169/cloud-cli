import {
    Component,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    OnInit,
    SimpleChanges,
    OnChanges,
    OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

import { DialogBaseComponent } from '../../models/base.component';
import { MwFormComponent } from '../mw-form-component/mw-form.component';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';
import { EventBus } from '../../services/eventbus.service';
import { BaseForm,TextboxForm,TextareaForm,DropdownForm,RadioForm,CardRuleForm,MwSelectForm } from '../../models/base-form.model';
import { MwStatus,CardType } from '../../models/mw.enum';
import { OrderItemType } from '../../models/mw.enum';
import { CardService } from '../../services/card.service';
import { CardBaseModel } from '../../models/card.model';
import { PayRule } from '../../models/pay-rule.model';
//import { IDialog } from '../../models/float-dialog.model';
import { MwLoadingBarService } from '../../services/mw-loading-bar.service';

@Component({
    selector: 'mw-edit-card-dialog',
    templateUrl: './mw-edit-card.dialog.html',
    styleUrls: ['./mw-edit-card.dialog.scss']
})
export class MwEditCardDialog extends DialogBaseComponent implements OnInit,OnChanges,OnDestroy {
    @Input() editCardItem:CardBaseModel;
    @Output('onHide') hideEvent:EventEmitter<Object> = new EventEmitter();
    @ViewChild(MwFormComponent) mwForm:MwFormComponent;
    @ViewChild('cardRuleModal') cardRuleModal:ModalDirective;
    formList:BaseForm<Object>[];
    private loading:Observable<Object>;

    constructor(
      private commonService:CommonService,
      private userService:UserService,
      private cardService:CardService,
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
          if (changes['editCardItem'] && changes['editCardItem'].currentValue) {
                this.loading = this.cardService.getById(this.editCardItem.id)
                  .map(
                      (res) => {
                          this.editCardItem = res;
                          this.formList = this.initFormItems();
                          return true;
                      },
                      (error:any) => {
                          this.eventNotice("alert.message", error);
                      }
                  );
          }else{
            this.formList = this.initFormItems();
          }
      }
    }

    OKClick(answer:any){
      if(this.mwForm.form.valid){
        this.getFormValue();
        this.startSlimLoader();
        this.cardService.save(this.editCardItem)
          .subscribe(
              (res) => {
                  this.hideEvent.emit(this.editCardItem);
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

    // dialogOKClick(answer:PayRule[]){
    //   console.log('dialogCancelClick');
    //   this.editCardItem.payRules = answer;
    //   this.formList = this.initFormItems();
    // }
    // dialogCancelClick(answer:any){
    //     console.log('dialogCancelClick');
    // }

    private getFormValue(){
      if(!this.editCardItem){
        this.editCardItem = new CardBaseModel(CardType.DISCOUNT);
      }
      this.mwForm.items.forEach((item:any,index:number)=>{
        this.editCardItem[item.key] = item.getValue();
      });
    }

    private initFormItems() {
      let items: BaseForm<any>[] = [
        new RadioForm({
          key: 'type',
          label: '卡类型',
          options: this.userService.cardTypeList,
          disabled: this.editCardItem && this.editCardItem.id>0?true:false,
          defaultValue:this.editCardItem?{value:this.editCardItem.cardType}:{value: CardType.DISCOUNT}
        }),
        new TextboxForm({
          key: 'name',
          label: '卡名称',
          value: '',
          required: true,
          minlength:2,
          placeholder:'卡名称',
          defaultValue:this.editCardItem?this.editCardItem.name:null
        }),
        new MwSelectForm({
          key: 'storeList',
          label: '所属门店',
          options: this.userService.storeMwSelectList,
          multiple:true,
          required: true,
          defaultValue:this.editCardItem?this.editCardItem.storeList:[]
        }),
        new TextboxForm({
          key: 'price',
          label: '卡售价',
          type: 'number',
          placeholder:'卡售价',
          required: true,
          addon:'¥',
          defaultValue:this.editCardItem?this.editCardItem.price:null
        }),
        // new TextboxForm({
        //   key: 'deposit',
        //   label: '卡面额',
        //   type: 'number',
        //   placeholder:'卡面额',
        //   required: true,
        //   addon:'¥',
        //   defaultValue:this.editCardItem?this.editCardItem.deposit:null
        // }),
        new CardRuleForm({
          key: 'payRules',
          label: '卡折扣',
          required: true,
          defaultValue: this.editCardItem?this.editCardItem.payRules:[]
        }),
        new TextboxForm({
          key: 'code',
          label: '序号',
          type: 'number',
          placeholder:'序号',
          defaultValue:this.editCardItem?this.editCardItem.code:null
        }),
        new RadioForm({
          key: 'sellType',
          label: '销售类型',
          options: [
            {value: MwStatus.AVAILABLE,  name: '购买'},
            {value: MwStatus.UNAVAILABLE,  name: '赠送'}
          ],
          defaultValue:this.editCardItem?{value:this.editCardItem.sellType}:{value: MwStatus.AVAILABLE}
        }),
        new RadioForm({
          key: 'status',
          label: '销售状态',
          options: [
            {value: MwStatus.AVAILABLE,  name: '可售'},
            {value: MwStatus.UNAVAILABLE,  name: '不可售'}
          ],
          defaultValue:this.editCardItem?{value:this.editCardItem.status}:{value: MwStatus.AVAILABLE}
        }),
        new RadioForm({
          key: 'holderStatus',
          label: '卡类型',
          options: [
            {value: MwStatus.AVAILABLE,  name: '实体卡'},
            {value: MwStatus.UNAVAILABLE,  name: '虚拟卡'}
          ],
          defaultValue:this.editCardItem?{value:this.editCardItem.holderStatus}:{value: MwStatus.AVAILABLE}
        }),
        new TextareaForm({
          key: 'description',
          label: '说明',
          type: 'text',
          placeholder:'说明',
          defaultValue:this.editCardItem?this.editCardItem.description:null
        })
      ];
      return items.sort((a, b) => a.order - b.order);
    }

    ngOnDestroy() {

    }

}    
