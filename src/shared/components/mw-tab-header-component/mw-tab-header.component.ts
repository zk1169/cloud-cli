import { Component, Input } from '@angular/core';

@Component({
    selector: 'mw-tab-header',
    template: `
      <div class="link-wrap" layout="row" layout-align="start center">
          <a *ngFor="let item of linkList" [routerLink]="[item.routerLink]" routerLinkActive="selected" class="mw-btn-hover">{{item.routerName}}</a>
      </div>
      `,
    styles: [`

    `]
})
export class MwTabHeaderComponent {
  @Input() linkList:{routerLink:string,routerName:string}[];

  constructor() {}
}
