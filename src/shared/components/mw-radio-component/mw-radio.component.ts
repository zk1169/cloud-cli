import { Component, Input, Output, EventEmitter,SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'mw-radio',
    template: `
      <div layout="row" layout-wrap>
        <div [class]="theme+' radio'" *ngFor="let item of dataList;let idx=index" (click)="radioClick($event,item)">
            <input type="radio" [id]='inputId+idx' [name]='inputId' [value]="item[valueName]" [(ngModel)]="checkedValue">
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
export class MwRadioComponent implements ControlValueAccessor {
    @Input() dataList: any[];
    @Input() labelName: string;
    @Input() valueName: string;
    @Input() groupName: string;
    //@Input() checked:any;
    @Input() theme:string;
    @Input('mwDisabled') disabled:boolean;
    private inputId: string;
    private labelId: string;
    private checkedValue:any;

    constructor(ngControl: NgControl) {
        ngControl.valueAccessor = this; // override valueAccessor
        this.labelId = this.inputId = new Date().getTime() + "_";
        this.labelName = "name";
        this.valueName = "value";
        this.theme = "";
        this.disabled = false;
    }

    ngOnChanges(changes: SimpleChanges) {}

    ngAfterViewInit(){
        if(this.disabled){
            this.labelId = this.inputId+'mw';
        }
    }

    radioClick(ev:any,item: any) {
      if(this.disabled){
          return;
      }
      //this.checked[this.labelName] = item[this.labelName];
      //this.checked[this.valueName] = item[this.valueName];
      this.onChange(item[this.valueName]);
    }

    writeValue(value: any): void {
        this.checkedValue = value;
    }
    onChange = (_) => {};
    //onTouched = () => {};
    registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        //this.onTouched = fn;
    }
}
