import { Component, Input, Output, EventEmitter } from '@angular/core';

//(keyup)="doSearch($event)"
@Component({
    selector: 'mw-search',
    template: `
      <div class="mw-search-wrap" layout='row' layout-align="start center">
        <i class="fa fa-search" (click)="doSearch({code:'Enter'})"></i>
        <input flex [(ngModel)]="searchText" (ngModelChange)="searchTextChange($event)" [mwFocus]="true" (keyup)="doSearch($event)" type="text" [placeholder]="placeholder">
        <i class="fa fa-times-circle" (click)="delClick()"></i>
      </div>
      `,
    styles: [`
      .mw-search-wrap{
        border-radius: 20px;
        padding: 4px 6px 4px 10px;
        background-color: #fff;
        min-width: 220px;
      }
      input{
        background-color: transparent;
        border: none;
        font-size: 12px;
        color:#666;
        padding:0px 5px;
      }
      input:focus{outline:none;}
      i{color:#666;}
    `]
})
export class MwSearchComponent {
    @Input() searchText: string;
    @Input() placeholder: string = '';
    @Output() doSearchEvent: EventEmitter < Object > = new EventEmitter();

    private wait:boolean;
    private async:any;
    constructor() {}

    doSearch(ev: any) {
        if (ev.code == "Enter") {
            this.wait = false;
            if(this.async){
              clearTimeout(this.async);
            }
            this.doSearchEvent.emit({ searchText: this.searchText });
        }
    }
    searchTextChange(ev:any){
      if(this.wait){
        if(this.async){
          clearTimeout(this.async);
          this.startTimeout(ev);
        }
      }else{
        this.wait = true;
        //console.log("waiting");
        this.startTimeout(ev);
      }
    }

    delClick() {
        this.searchText = "";
    }

    private startTimeout(text:string){
      var self = this;
      this.async = setTimeout(function(){
        if(self.wait){
          //console.log("excute");
          self.wait = false;
          self.async = null;
          self.doSearchEvent.emit({ searchText: text });
        }
      },1000);
    }
}
