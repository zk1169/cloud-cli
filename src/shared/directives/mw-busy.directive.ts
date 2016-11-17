import { Directive, ElementRef, HostListener, Input ,SimpleChange,OnChanges,SimpleChanges} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Directive({ selector: '[mwBusy]' })
export class MwBusyDirective implements OnChanges{

    private busyTemplate:string;
    private el: HTMLElement;
    private divElement:HTMLElement = document.createElement("div");
    constructor(el: ElementRef) { 
        this.el = el.nativeElement;
        //this.el.style.position = 'relative';
        this.createDivElement();
    }

    @Input('mwBusy') busy: Observable<Object>;

    ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            if (changes['busy'] && changes['busy'].currentValue) {
                this.el.appendChild(this.divElement);
                changes['busy'].currentValue.subscribe(
                    (res:any)=>{
                        // let self = this;
                        // setTimeout(function(){
                        //     self.el.removeChild(self.divElement);
                        // },2000);
                        this.el.removeChild(this.divElement);
                    },
                    (err:any)=>{
                        this.el.removeChild(this.divElement);
                    }
                );
            }
        }
    }

    private createDivElement(){
        this.divElement = document.createElement("div");
        this.divElement.style.position = "absolute";
        this.divElement.style.zIndex = "2";
        this.divElement.style.left = "0px";
        this.divElement.style.top = "0px";
        this.divElement.style.width = "100%";
        this.divElement.style.height = "100%";
        this.divElement.style.display = "flex";
        this.divElement.style.alignItems = "center";
        this.divElement.style.justifyContent = "center";
        this.divElement.style.backgroundColor = "rgba(0,0,0,.6)";
        this.divElement.style.color = "#fff";
        //this.divElement.innerText = "loading...";
        this.divElement.innerHTML = '<div class="icon-rotate"><i class="fa fa-spinner mw-fs-20"></i></div>';
    }

    // ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    //     if (changes.hasOwnProperty('collapse')) {
    //         if(changes['collapse'].currentValue){
    //             if(this._property == "horizontal"){
    //                 this.el.style.width = "0px";
    //             }else{
    //                 this.el.style.height = "0px";
    //             }
    //         }else{
    //             if(this._property == "horizontal"){
    //                 this.el.style.width = "210px";
    //             }else{
    //                 this.el.style.height = this.height;
    //             }
    //         }
    //     }
    // }
}
