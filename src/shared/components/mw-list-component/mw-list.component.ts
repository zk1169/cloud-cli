import { Component, Input, Output, EventEmitter,OnChanges,SimpleChanges,ViewChild } from '@angular/core';

@Component({
    selector: 'mw-list',
    template: `
      <div class="link-wrap" layout="row" layout-align="start center">
          <a *ngFor="let item of linkList" [routerLink]="[item.routerLink]" routerLinkActive="selected">{{item.routerName}}</a>
      </div>
      <li *ngFor="let item of itemList;trackBy:trackByItem;let idx=index;" class="mw-list-item" [class.listItemChanged]="item.changed">
        <ng-content></ng-content>
      </li>
      `,
    styles: [`

    `]
})
export class MwListComponent {
  @Input() itemList:any[];

  constructor() {}
}
