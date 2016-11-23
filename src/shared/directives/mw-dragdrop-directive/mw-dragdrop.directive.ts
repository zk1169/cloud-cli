import { Directive, Input, ElementRef, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { MwDragDropService } from './mw-dragdrop.provider';
import { dragula } from './mw-dragdrop.model';

@Directive({
  selector: '[mwDragDrop]'
})
export class MwDragDropDirective implements OnInit, OnChanges {
  @Input('mwDragDrop') public bag: string;
  @Input() public dragulaModel: any;
  private container: any;
  private drake: any;

  public constructor(private el: ElementRef, private dragulaService: MwDragDropService) {
    this.container = el.nativeElement;
  }

  public ngOnInit(): void {
    // console.log(this.bag);
    let bag = this.dragulaService.find(this.bag);
    let checkModel = () => {
      if (this.dragulaModel) {
        if (this.drake.models) {
          this.drake.models.push(this.dragulaModel);
        } else {
          this.drake.models = [this.dragulaModel];
        }
      }
    };
    if (bag) {
      this.drake = bag.drake;
      checkModel();
      this.drake.containers.push(this.container);
    } else {
      this.drake = dragula({
        containers: [this.container]
      });
      checkModel();
      this.dragulaService.add(this.bag, this.drake);
    }
  }

  public ngOnChanges(changes: {[propName: string]: SimpleChange}): void {
    // console.log('dragula.directive: ngOnChanges');
    // console.log(changes);
    if (changes && changes['dragulaModel']) {
      if (this.drake) {
        if (this.drake.models) {
          let modelIndex = this.drake.models.indexOf(changes['dragulaModel'].previousValue);
          this.drake.models.splice(modelIndex, 1, changes['dragulaModel'].currentValue);
        } else {
          this.drake.models = [changes['dragulaModel'].currentValue];
        }
      }
    }
  }
}