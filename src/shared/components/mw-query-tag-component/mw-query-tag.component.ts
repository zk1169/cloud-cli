import { Component, Input,Output,EventEmitter,OnChanges,SimpleChanges }  from '@angular/core';
import { QueryTagModel } from '../../models/query-tag.model';

@Component({
  selector: 'mw-query-tag',
  templateUrl: './mw-query-tag.component.html',
  styleUrls: ['./mw-query-tag.component.scss']
})
export class MwQueryTagComponent implements OnChanges {
  @Input() allTags: QueryTagModel[] = [];
  @Input() queryName: string;
  @Input() multipleSelected:boolean;
  @Input() selected:any;
  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
      if (changes) {
          if (changes['selected']) {
            if(changes['selected'].currentValue){
              this.allTags.forEach((item:any)=>{
                  if(item.value == changes['selected'].currentValue){
                      item.selected = true;
                  }else{
                      item.selected = false;
                  }
              });
            }else{
              this.allTags[0].selected = true;
            }
          }
      }
  }

  itemClick(tag:QueryTagModel){
    tag.selected=!tag.selected;
    if(!this.multipleSelected){
      if(this.allTags){
        this.allTags.forEach((item:QueryTagModel,index:number)=>{
          if(item != tag){
            item.selected = false;
          }
        });
      }
    }
    let selectedTags:QueryTagModel[] = [];
    if(this.allTags){
      this.allTags.forEach((item:QueryTagModel,index:number)=>{
        if(item.selected){
          selectedTags.push(item);
        }
      });
    }
    if(this.multipleSelected){
      this.onChange.emit(selectedTags);
    }else{
      this.onChange.emit(selectedTags[0]);
    }
  }

  getItemClass(item:any){
    return {
      'mw-bg-primary':item.selected,
      'mw-bg-text':item.selected,
      'mw-bg-text-hover':item.selected
    };
  }

}
