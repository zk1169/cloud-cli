import { ElementRef, Renderer, Directive,Input,SimpleChanges } from '@angular/core';

@Directive({
  //selector: "input:not([type=submit])[mwFocus], textarea[mwFocus]"
  selector: "[mwFocus]"
})
export class MwFocusDirective {
	@Input() mwFocus:boolean;
  constructor( private ele : ElementRef, private renderer : Renderer ) {
  }

  // ngAfterContentInit() {
  //   this.renderer.invokeElementMethod(this.ele.nativeElement, 'focus');
  // }

  ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            if (changes['mwFocus'] && changes['mwFocus'].currentValue) {
                this.renderer.invokeElementMethod(this.ele.nativeElement, 'focus');
            }else{
            	this.renderer.invokeElementMethod(this.ele.nativeElement, 'blur');
            }
        }
    }
}