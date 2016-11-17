import { Component, Input, Output, EventEmitter,OnChanges,SimpleChanges,ViewChild,ElementRef } from '@angular/core';
import { TreeModel } from '../../models/tree.model';

@Component({
    selector: 'mw-tree',
    template: `
      <div class="mw-tree-wrap">
        <div class="tree-node">
          <i class="fa fa-plus mw-click mw-primary" *ngIf="treeModel?.collapse && !treeModel?.isLeaf" (click)="treeModel.collapse=!treeModel.collapse"></i>
          <i class="fa fa-minus mw-click mw-primary" *ngIf="!treeModel?.collapse && !treeModel?.isLeaf" (click)="treeModel.collapse=!treeModel.collapse"></i>
          <i class="fa fa-file-text-o" *ngIf="treeModel?.isLeaf"></i>
          &nbsp;
          <div class="checkbox checkbox-primary" #treeNode [tooltip]="treeModel?.name" [tooltipEnable]="treeNode.clientWidth>199">
            <input #checkbox type="checkbox" [(ngModel)]="checked" [attr.id]="treeModel?.code">
            <label class="tree-label text-overflow" [attr.for]="treeModel?.code">{{treeModel?.name}}</label>
          </div>
        </div>
        <div *ngIf="!treeModel?.collapse" class="sub-tree-node">
          <div *ngFor="let item of treeModel?.children">
            <mw-tree [treeModel]="item" (onNodeSelected)="onNodeSelected($event)"></mw-tree>
          </div>
        </div>
      </div>
      `,
    styles: [`
      :host{
        display:block;
      }
      i{
        float: left;
        margin-top: 5px;
      }
      
      .checkbox{
        display:inline-block;
      }
      .tree-node1{
        padding-bottom:10px;
      }
      .mw-tree-wrap1{
        margin-bottom:10px;
      }
      .sub-tree-node{
        margin:0px 20px;
      }
      .tree-label{
        max-width:200px;
      }
    `]
})
export class MwTreeComponent {
  @Input() treeModel:TreeModel;
  @Output('onNodeSelected') selectedEvent:EventEmitter<Object> = new EventEmitter();
  @ViewChild('checkbox') checkbox:ElementRef;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
        if (changes['treeModel'] && changes['treeModel'].currentValue) {
          this.treeModel.checkbox = this.checkbox.nativeElement;
        }
    }
  }

  get checked(){
    if(this.treeModel){
      return this.treeModel.checked;
    }else{
      return false;
    }
  }
  set checked(value:boolean){
    this.treeModel.checked = value;
    this.selectedEvent.emit(this.treeModel);
  }

  // get indeterminate(){
  //   return this.treeModel.indeterminate
  // }

  onNodeSelected(ev:TreeModel){
    this.selectedEvent.emit(ev);
  }
}
