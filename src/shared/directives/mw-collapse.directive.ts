import { Directive, ElementRef, HostListener, Input ,SimpleChange,AfterViewInit,OnChanges} from '@angular/core';

@Directive({ selector: '[mwCollapse]' })
export class MwCollapseDirective implements AfterViewInit,OnChanges{
    private height:string;
    private width:string;
    private el: HTMLElement;

    @Input('mwCollapse') collapse: boolean;
    /*
        竖向:"vertical"
        横向:"horizontal"
    */
    @Input() direction:string = 'horizontal';

    constructor(el: ElementRef) { 
        this.el = el.nativeElement;
        this.el.style.transition = 'all 0.2s';
    }

    ngAfterViewInit(){
        this.el.style.overflow = "hidden";
        if(this.direction == "vertical"){
            this.height = this.el.scrollHeight+"px";
            if(!this.collapse){
                this.el.style.height = this.height;
            }
        }else{
            this.width = this.el.scrollWidth+"px";
            if(!this.collapse){
                this.el.style.width = this.width;
            }
        }
    }

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        if (changes.hasOwnProperty('collapse')) {
            if(changes['collapse'].currentValue){
                if(this.direction == "horizontal"){
                    this.el.style.width = "0px";
                }else{
                    this.el.style.height = "0px";
                }
            }else{
                if(this.direction == "horizontal"){
                    //this.el.style.width = "210px";
                    this.el.style.width = this.width;
                }else{
                    this.el.style.height = this.height;
                }
            }
        }
    }
    // @HostListener('mouseenter') onMouseEnter() {
    //     this.highlight(this.highlightColor || this._defaultColor);
    // }
    // @HostListener('mouseleave') onMouseLeave() {
    //     this.highlight(null);
    // }
    // private highlight(color: string) {
    //     this.el.style.backgroundColor = color;
    // }
}
