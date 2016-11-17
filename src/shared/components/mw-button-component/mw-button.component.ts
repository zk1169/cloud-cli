import { Component, Input, Output, EventEmitter,OnChanges,SimpleChanges,ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'mw-button',
    template: `
      <div [mwBusy]="clickAysn" class="mw-busy-wrap">
          <button class="mw-button-white btn-save" (click)="onClick()">
              保存
          </button>
      </div>
      `,
    styles: [`
      :host{
        min-width:100px;
      }
    `]
})
export class MwButtonComponent {
  @Input() text:string;
  @Input() args:any;
  //@Input() click:any;
  @Output('onclick') clickEvent:EventEmitter<Object> = new EventEmitter();

  private clickAysn:Observable<Object>;

  constructor() {
  }

  onClick(){
    //this.clickAysn = this.clickEvent.emit();
    //debugger;
    //this.clickAysn = this.click();
    this.clickEvent.emit({aysn:this.clickAysn,args:this.args});
  }

}
