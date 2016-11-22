import { Component, Input, Output, EventEmitter,OnChanges,SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { PayRule } from '../../models/pay-rule.model';
import { DialogBaseComponent } from '../../models/base.component';
import { IDialog } from '../../models/dialog.interface';
import { EventBus } from '../../services/eventbus.service';
import { MwLoadingBarService } from '../../services/mw-loading-bar.service';

// <ul class="mw-list" [mwCollapse]="!showDetail" direction="vertical">
@Component({
    selector: 'mw-card-rule',
    template: `
      <div class="mw-card-rule-wrap">
            <div class="header mw-bg-primary mw-click" layout="row">
                <div (click)="showDetail=!showDetail">
                  <i class="fa fa-plus" *ngIf="!showDetail"></i>
                  <i class="fa fa-minus" *ngIf="showDetail"></i>
                  <span>卡折扣</span>
                </div>
                <span flex></span>
                <span class="mw-click" (click)="eidtClick()">设置折扣</span>
            </div>
            <ul class="mw-list" [collapse]="!showDetail">
                <li *ngFor="let item of ruleList" class="mw-list-item">
                    <div layout="row" layout-align="start center">
                        <div flex="30">{{item.name}}</div>
                        <div flex="70">
                          <span *ngFor="let storeItem of item.storeRuleList" class="store-rule-item mw-border-primary">
                            <span>{{storeItem.storeName}}</span>
                            <span>{{storeItem.discountValue|mwCardRule:storeItem.discountType}}</span>
                          </span>
                        </div>
                    </div>
                </li>
                <li *ngIf="!ruleList || ruleList.length == 0" class="list-item-empty-small">
                    <img src="assets/images/empty.png"/>
                </li>
            </ul>
            <div [formGroup]="formGroup">
              <input type="hidden" [id]="formName" [formControlName]="formName" [(ngModel)]="formValue"/>
            </div>
      </div>
      `,
    styles: [`
      .header{
        padding:10px;
        color: #fff;
      }
      .mw-list{
        border:solid 1px rgba(0,0,0,0.12);
      }
      .mw-list-item{
        padding-bottom:0px;
      }
      .mw-list-item+.mw-list-item{
        border-top:solid 1px rgba(0,0,0,0.12);
      }
      .store-rule-item{
        padding:5px;
        border:solid 1px #fff;
        display:inline-block;
        margin-right:10px;
        margin-bottom:10px;
      }
    `]
})
export class MwCardRuleComponent extends DialogBaseComponent implements IDialog {
  private showDetail:boolean = true;
  private formValue:string;
  @Input() formName:string;
  @Input() formGroup:FormGroup;
  @Input() ruleList:PayRule[];
  @Output('onEditClick') editClickEvent:EventEmitter<Object> = new EventEmitter();

  constructor(eventBus: EventBus,slimLoader: MwLoadingBarService) {
    super(slimLoader, eventBus);
  }

  eidtClick(){
    //this.discountClickEvent.emit();
    this.dialogArgs = this.ruleList;
    this.showDialog("show.modal",this,"card-rule-dialog");
  }

  dialogOKClick(answer:PayRule[]){
    console.log('dialogCancelClick');
    this.ruleList = answer;
  }
  dialogCancelClick(answer:any){
    console.log('dialogCancelClick');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
        if (changes['ruleList'] && changes['ruleList'].currentValue) {
          this.formValue = this.ruleList.join(',');
        }else{
          this.formValue = null;
        }
    }
  }
}
