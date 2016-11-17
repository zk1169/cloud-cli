import { ElementRef, Renderer, Directive,Input,SimpleChanges } from '@angular/core';

@Directive({
  //selector: "input:not([type=submit])[mwFocus], textarea[mwFocus]"
  selector: "[mwImage404]"
  //selector: "img[mwImage404]"
})
export class MwImage404Directive {
	@Input('mwImage404') src:string;
  constructor( private ele : ElementRef, private renderer : Renderer ) {}

  // ngAfterContentInit() {
  //   this.renderer.invokeElementMethod(this.ele.nativeElement, 'focus');
  // }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
        if (changes['src'] && changes['src'].currentValue) {
            //let img = new Image();
            var self = this;
            this.ele.nativeElement.src = this.src;
            this.ele.nativeElement.innerHTML = '<div class="icon-rotate"><i class="fa fa-spinner mw-fs-20"></i></div>';
            this.ele.nativeElement.onload = function(){

            };
            this.ele.nativeElement.onerror = function(){
              self.ele.nativeElement.src = 'assets/images/default_female.png';
            }
        }else{
        	this.ele.nativeElement.src = 'assets/images/default_female.png';
        }
    }
  }
}