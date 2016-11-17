import { Component, Input, Output, EventEmitter,OnChanges,SimpleChanges,ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectComponent } from 'ng2-select/ng2-select';

//[active]="[selectedItem]"
//(selected)="selected($event)"
@Component({
    selector: 'mw-select',
    template: `
      <ng-select [allowClear]="allowClear"
          [(items)]="options"
          [multiple]="multiple"
          [placeholder]="placeholder"
          (data)="refreshValue($event)">
      </ng-select>
      `,
    styles: [`
      :host{
        min-width:200px;
        position: relative;
        display: table-cell;
      }
      .form-hidden{
        display: table;
        width: 100%;
      }
    `]
})
export class MwSelectComponent {
  @Input() options:any;
  @Input() placeholder:string;
  @Input() textField:string;
  @Input() idField:any;
  @Input() allowClear:boolean;
  @Input() selectedItem:any;
  @Input() multiple:boolean;
  //@Output('onSelected') onSelected:EventEmitter<Object> = new EventEmitter();
  @ViewChild(SelectComponent) select: SelectComponent;

  constructor() {
    this.idField = "id";
    this.textField = "text";
    this.multiple = false;
  }

  ngOnInit(){
    if(this.multiple){
      if(this.selectedItem && this.selectedItem.length > 0){
        this.select.active = this.selectedItem;
      }else{
        this.select.active = null;
      }
    }else{
      if(this.selectedItem && this.selectedItem[this.idField]){
        this.select.active = [this.selectedItem];
      }else{
        this.select.active = null;
      }
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //       if (changes) {
  //         //debugger;
  //           if (changes['selectedItem']) {

  //           }
  //       }
  //   }
    refreshValue(value:any){
      if(Array.isArray(value) && Array.isArray(this.selectedItem)){
        //this.selectedItem = [];
        this.selectedItem.splice(0,this.selectedItem.length);
        value.forEach((item:any,index:number)=>{
          this.selectedItem.push(item);
        });
        // let selectedList = [];
        // value.forEach((item:any,index:number)=>{
        //   selectedList.push(item);
        // });
        // this.onSelected.emit(selectedList);
      }else if(value){
        if(!this.selectedItem){
          this.selectedItem = {};
        }
        this.selectedItem[this.idField] = value[this.idField];
        this.selectedItem.text = value.text;
        //this.onSelected.emit(value);
      }
    }
  // onSelected(item:any){
  //   // if(this.onSelectedEvent){
  //   //   this.onSelectedEvent.emit(item);
  //   // }
  //   if(!item) return;
  //   this.selectedItem.id = item.id;
  //   this.selectedItem.text = item.text;
  // }
}

@Component({
    selector: 'mw-select-form',
    template: `
      <div [formGroup]="formGroup" class="form-hidden">
        <ng-select [allowClear]="allowClear"
          [(items)]="options"
          [multiple]="multiple"
          [placeholder]="placeholder"
          (data)="refreshValue($event)">
        </ng-select>
        <input type="hidden" [id]="formName" [formControlName]="formName" [(ngModel)]="formValue"/>
      </div>
      `,
    styles: [`
      :host{
        min-width:200px;
        position: relative;
        display: table-cell;
      }
      .form-hidden{
        display: table;
        width: 100%;
      }
    `]
})
export class MwSelectFormComponent {
  @Input() options:any;
  @Input() placeholder:string;
  @Input() textField:string;
  @Input() idField:any;
  @Input() allowClear:boolean;
  @Input() selectedItem:any;
  @Input() multiple:boolean;
  @Input() formName:string;
  @Input() formGroup:FormGroup;
  @ViewChild(SelectComponent) select: SelectComponent;
  private formValue:string;

  constructor() {
    this.idField = "id";
    this.textField = "text";
    this.multiple = false;
    this.formName = new Date().getDate()+"";
  }

  ngOnInit(){
    if(this.multiple){
      if(this.selectedItem && this.selectedItem.length > 0){
        this.select.active = this.selectedItem;
        this.formValue = this.selectedItem.toString();
      }else{
        this.select.active = null;
        this.formValue = null;
      }
    }else{
      if(this.selectedItem && this.selectedItem[this.idField]){
        this.select.active = [this.selectedItem];
        this.formValue = this.selectedItem[this.idField];
      }else{
        this.select.active = null;
        this.formValue = null;
      }
    }
  }

    refreshValue(value:any){
      if(Array.isArray(value) && Array.isArray(this.selectedItem)){
        this.selectedItem.splice(0,this.selectedItem.length);
        value.forEach((item:any,index:number)=>{
          this.selectedItem.push(item);
        });
        this.formValue = this.selectedItem.toString();
      }else if(value){
        if(!this.selectedItem){
          this.selectedItem = {};
        }
        this.selectedItem[this.idField] = value[this.idField];
        this.selectedItem.text = value.text;
        this.formValue = this.selectedItem[this.idField];
        //this.onSelected.emit(value);
      }else{
        this.formValue = null;
      }
      try{
        if(this.formGroup && this.formName){
          this.formGroup.controls[this.formName]["markAsDirty"]();
        }
      }catch(e){}
      
    }
}
