import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'mw-radio',
    template: `
      <div layout="row" layout-wrap>
        <div [class]="theme+' radio'" *ngFor="let item of dataList;let idx=index" (click)="radioClick($event,item)">
            <input type="radio" id='{{inputId+idx}}' [attr.name]="groupName" [value]="item[valueName]" [(ngModel)]="checked.value">
            <label [class.disabled]="disabled" [attr.for]='labelId+idx'>{{item[labelName]}}</label>
        </div>
      </div>
      `,
    styles: [`
        .radio.radioWhite label::before{
            border: 2px solid #fff;
        }
        .radio.radioWhite label::after {
            background-color:#fff;
        }
    `]
})
export class MwRadioComponent {
    @Input() dataList: any[];
    @Input() labelName: string;
    @Input() valueName: string;
    @Input() groupName: string;
    @Input() checked:any;
    @Input() theme:string;
    @Input() disabled:boolean;
    private inputId: string;
    private labelId: string;

    constructor() {
        this.labelId = this.inputId = new Date().getTime() + "_";
        this.labelName = "name";
        this.valueName = "value";
        this.theme = "";
        this.disabled = false;
    }

    ngAfterViewInit(){
        if(this.disabled){
            this.labelId = this.inputId+'mw';
        }
    }

    radioClick(ev:any,item: any) {
      if(this.disabled){
          return;
      }
      this.checked[this.labelName] = item[this.labelName];
      this.checked[this.valueName] = item[this.valueName];
    }
}
