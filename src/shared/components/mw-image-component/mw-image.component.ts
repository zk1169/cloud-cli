import { Component, Input,OnChanges,SimpleChanges,ElementRef,ViewChild } from '@angular/core';
import { TreeModel } from '../../models/tree.model';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'mw-image',
    template: `
      <div class="mw-image-wrap">
        <img #image [src]="src"/>
        <div *ngIf="loading" class="loading" layout="row" layout-align="center center">
          <i class="icon-dengdai mw-fs-30 mw-rotate"></i>
        </div>
      </div>
      `,
    styles: [`
      :host{
        display:block;
      }
      .mw-image-wrap{
        position:relative;
      }
      .loading{
        position:absolute;
        height:100%;
        width:100%;
        top:0px;
      }
    `]
})
export class MwImageComponent implements OnChanges {
  @Input('src') src:string;
  @ViewChild('image') image:ElementRef;
  loading:boolean;

  constructor(private ele : ElementRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
        if (changes['src'] && changes['src'].currentValue) {
            //console.log('src='+this.src);
            if(!this.src){
              this.image.nativeElement.src = environment.localAvatarDefault;
              return;
            }
            //let img = new Image();
            var self = this;
            this.image.nativeElement.src = this.src;
            this.loading = true;
            //console.log('loading image loading');
            this.image.nativeElement.onload = function(){
              //console.log('loading image done');
              self.loading = false;
            };
            this.image.nativeElement.onerror = function(){
              //console.log('loading image error');
              self.image.nativeElement.src = environment.localAvatarDefault;
              self.loading = false;
            }
        }else{
          this.image.nativeElement.src = environment.localAvatarDefault;
        }
    }
  }
}
