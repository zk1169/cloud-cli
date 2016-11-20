import {
    Component,
    Output,
    Input,
    EventEmitter,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

// <i class="caret drop-down-icon mw-click"></i>
@Component({
    selector: 'mw-autocomplete',
    template: `
        <div class="mw-autocomplete-content">
          <input [(ngModel)]="searchText"
            [typeahead]="dataSource"
            (typeaheadLoading)="changeTypeaheadLoading($event)"
            (typeaheadNoResults)="changeTypeaheadNoResults($event)"
            (typeaheadOnSelect)="typeaheadOnSelect($event)"
            [typeaheadOptionsLimit]="7"
            [typeaheadOptionField]="displayName"
            [typeaheadMinLength]="0"
            [typeaheadWaitMs]="1000"
            [typeaheadAsync]="true"
            [placeholder]="placeholder"
            [disabled]="disabled"
            class="form-control">
          <div *ngIf="typeaheadLoading===true" class="mw-autocomplete-loading">
            <div class="loading-progress mw-progress"></div>
          </div>
          <div *ngIf="typeaheadNoResults===true" class="mw-autocomplete-empty">
            <i class="fa fa-close"></i> No Results Found
          </div>
        </div>
   `,
    styleUrls: ['./mw-autocomplete.component.scss']
})
export class MwAutocompleteComponent implements OnChanges{
    @Input() searchText: string = '';
    private typeaheadLoading: boolean = false;
    private typeaheadNoResults: boolean = false;
    @Input() dataSource: Observable < any > ;
    @Input() placeholder: string;
    @Input() displayName: string;
    @Input() selectedItem: any;
    @Input() disabled: boolean;
    @Output() onSelected:EventEmitter<Object> = new EventEmitter();

    constructor() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            if (changes['selectedItem'] && changes['selectedItem'].currentValue) {
                this.searchText = changes['selectedItem'].currentValue.name;
            }
        }
    }

    getSearchText() {
        return this.searchText;
    }

    changeTypeaheadLoading(e: boolean) {
        this.typeaheadLoading = e;
    }

    changeTypeaheadNoResults(e: boolean) {
        this.typeaheadNoResults = e;
    }

    typeaheadOnSelect(e: any) {
        //console.log('Selected value: ', e.item);
        //this.selectedItem = e.item;
        for (let prop in e.item) {
            if(e.item.hasOwnProperty(prop)){
                this.selectedItem[prop] = e.item[prop];
            }
        }
        if(this.onSelected){
            this.onSelected.emit(this.selectedItem);
        }
    }
}
