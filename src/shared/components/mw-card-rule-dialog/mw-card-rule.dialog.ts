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

import { BaseComponent } from '../../models/base.component';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';
import { EventBus } from '../../services/eventbus.service';
import { CardBaseModel } from '../../models/card.model';
import { IDialog } from '../../models/dialog.interface';
import { TreeModel } from '../../models/tree.model';
import { PayRule,StoreRule } from '../../models/pay-rule.model';
import { PayRuleType } from '../../models/mw.enum';
import { MwLoadingBarService } from '../../services/mw-loading-bar.service';

@Component({
    selector: 'mw-card-rule-dialog',
    templateUrl: './mw-card-rule.dialog.html',
    styleUrls: ['./mw-card-rule.dialog.scss']
})
export class MwCardRuleDialog extends BaseComponent implements OnInit,OnChanges,OnDestroy {
    @Input() parent:IDialog;
    @Output('onHide') hideEvent:EventEmitter<Object> = new EventEmitter();
    private tree:TreeModel;
    private loading:Observable<Object>;
    private ruleList:PayRule[];
    private storeRuleList:StoreRule[];

    constructor(
      private commonService:CommonService,
      private userService:UserService,
      eventBus: EventBus,
      slimLoader: MwLoadingBarService
    ) {
        super(slimLoader, eventBus);
        this.startSlimLoader();
        this.loading = this.commonService.getAllTreeModelItem(0,'11111')
          .map(
                (res) => {
                    res.data = PayRule.createAllStoreRule();
                    this.tree = res;
                    this.completeSlimLoader();
                    let self = this;
                    setTimeout(function(){
                        self.initTreeItem();
                    },100);
                    return true;
                },
                (error:any) => {
                    this.eventNotice("alert.message", error);
                    this.completeSlimLoader();
                }
            );
    }

    ngOnInit(){
        this.ruleList = this.parent.dialogArgs;
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes) {
          // if (changes['editCardItem'] && changes['editCardItem'].currentValue) {
          // }
      }
    }

    onNodeSelected(ev:TreeModel){
        console.log('onNodeSelected');
        if(!ev || !ev.data){
            return;
        }
        let ruleModel:PayRule = ev.data;

        if(ev.checked && ruleModel.type != PayRuleType.ALL){
            ruleModel.storeRuleList = [];
            this.userService.permissionStoreList.forEach((item:any)=>{
                ruleModel.storeRuleList.push(new StoreRule(item.id,item.name));
            });
        }
        
        if(!this.ruleList){
            this.ruleList = [ruleModel];
        }else{
            let ruleIndex = -1;
            this.ruleList.forEach((item:PayRule,index:number)=>{
                if(ev.code == item.categoryCode){
                    ruleIndex = index;
                    return;
                }
            });
            if(ruleIndex > -1){
                if(ev.checked){
                    this.ruleList.push(ruleModel);
                }else{
                    if(this.ruleList[ruleIndex].selected){
                        this.storeRuleList = null;
                    }
                    this.ruleList.splice(ruleIndex,1);
                }
            }else{
                if(ev.checked){
                    this.ruleList.push(ruleModel);
                }
            }
        }
    }

    OKClick(answer:any){
      if(this.parent){
            this.parent.dialogOKClick(this.ruleList);
        }
      this.hideEvent.emit();
    }

    hide(){
        if(this.parent){
            this.parent.dialogCancelClick(null);
        }
        this.hideEvent.emit();
    }

    ruleItemClick(ruleItem:PayRule){
        this.ruleList.forEach((item:PayRule)=>{
            item.selected = false;
        });
        ruleItem.selected = true;
        this.storeRuleList = ruleItem.storeRuleList;
    }

    ngOnDestroy() {

    }

    private initTreeItem(){
        if(this.tree){
            this.tree.initTree(this.ruleList);
        }
    }

}    
