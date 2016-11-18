import { Component, Input, Output, EventEmitter,OnChanges,SimpleChanges,ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SortModel } from '../../models/sort.model';

@Component({
    selector: 'mw-list-sort',
    template: `
      <span class="mw-click" (click)="sortChanged()">
          <ng-content></ng-content>
          <i [class]="sortClassName"></i>
      </span>
      `,
    styles: [`
      :host{
        
      }
    `]
})
export class MwListSortComponent implements OnChanges{
  @Input('sortModel') sortModel:SortModel;
  @Output('onSortChanged') onSortEvent: EventEmitter<Object> = new EventEmitter();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
        if (changes['sortModel'] && changes['sortModel'].currentValue) {

        }else{
          
        }
    }
  }

  sortChanged(){
    if(!this.sortModel){
      return;
    }
    this.sortModel.reverse();
    this.onSortEvent.emit(this.sortModel);
  }

  get sortClassName(){
    if(!this.sortModel){
      //return 'fa fa-unsorted';
      return 'icon-paixu3';
    }
    let className:string;
    switch(this.sortModel.sortType){
      case "":
        //className = 'fa fa-unsorted';
        className = 'icon-paixu3';
        break;
      case "asc":
        //className = 'fa fa-sort-asc';
        className = 'icon-paixu1';
        break;
      case "desc":
        //className = 'fa fa-sort-desc';
        className = 'icon-paixu2';
        break;
    }
    return className;
  }
}
