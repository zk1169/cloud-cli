import { Component, Input, Output, EventEmitter,OnChanges,SimpleChanges,ViewChild } from '@angular/core';

@Component({
    selector: 'mw-pagination',
    template: `
      <div class="pagination-wrap">
          <span class="page-total">当前共搜到{{totalCount}}条记录&nbsp;&nbsp;</span>
          <pagination class="pagination-sm" 
            [totalItems]="totalItems" 
            [itemsPerPage]="itemsPerPage" 
            [(ngModel)]="currentPage" 
            (pageChanged)="pageChanged($event)" 
            [maxSize]="maxSize" 
            [boundaryLinks]="boundaryLinks" 
            [rotate]="rotate" 
            [firstText]="firstText" 
            [previousText]="previousText" 
            [nextText]="nextText" 
            [lastText]="lastText">
          </pagination>
      </div>
      `,
    styles: [`
      .pagination-wrap{
        text-align:right;
        padding-right:20px;
        background-color:#f8f8f8;
        height:50px;
      }
      .pagination-sm{
        height: 50px;
        display: inline-block;
      }
      .page-total{
        float:left;
        height: 50px;
        line-height: 50px;
        margin-left:20px;
      }
    `]
})
export class MwPaginationComponent {
  @Input() totalItems:number;
  @Input() itemsPerPage:number;
  @Input() currentPage:number;
  @Output('pageChanged') pageChangedEvent:EventEmitter<Object> = new EventEmitter();

  private maxSize: number = 5;
  private boundaryLinks: boolean = true;
  private directionLinks: boolean = true;
  private firstText: string = "首页";
  private previousText: string = "上一页";
  private nextText: string = "下一页";
  private lastText: string = "末页";
  private rotate: boolean = false;
  private pageBtnClass:string;
  constructor() {
    this.itemsPerPage = 10;
  }

  pageChanged(ev:any){
    this.pageChangedEvent.emit(ev);
  }

  get totalCount(){
    if(this.totalItems){
      return this.totalItems;
    }else{
      return 0;
    }
  }

}
