import {
    Component,
    ElementRef,
    Output,
    Input,
    EventEmitter,
    HostListener,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    OnDestroy
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import * as moment from 'moment';

let mwDatetimeComponent: MwDatetimeComponent = null;

@Component({
    selector: 'mw-datetime',
    template: `
    <div dropdown autoClose="disabled" [(isOpen)]="isOpen" (onToggle)="onToggle($event)">
        <div dropdownToggle>
            <div class="form-inline form-group">
                <div class="input-group date">
                    <input [(ngModel)]="inputValue" (ngModelChange)="inputValueChanged($event)" type="text" class="form-control" [disabled]="disabledInput"/>
                    <div class="input-group-addon" *ngIf="!hideIcon">
                        <i class="fa fa-calendar"></i>
                    </div>
                </div>
            </div>
        </div>
        <div dropdownMenu>
            <datepicker [(ngModel)]="date" (selectionDone)="dateSelectionDone($event)" [showWeeks]="false"></datepicker>
        </div>
    </div>
    <div *ngIf="hideTimePicker">
        <timepicker [(ngModel)]="date" [showMeridian]="false"></timepicker>
    </div>
   `,
    styles: [`
          :host{height:34px;}
          .dropdown-menu{
              padding:0;
              margin:0;
          }
          .date{width:100%;}
          .date .form-control{
              min-width:120px;
              border-radius: 4px;
          }
          .well{
              margin-bottom:0!important;
          }
    `]
})
export class MwDatetimeComponent implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {
    @Input() date: Date;
    @Input() disabledInput:boolean = false;
    @Input() hideIcon:boolean = false;
    @Input() hideTimePicker:boolean = false;
    @Output() onChange = new EventEmitter();

    private inputValue: string;
    private isOpen: boolean = false;
    private el: HTMLElement;

    constructor(ngControl: NgControl, el: ElementRef) {
        ngControl.valueAccessor = this; // override valueAccessor
        this.el = el.nativeElement;
    }

    ngAfterViewInit() {
        this.init();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            if (changes['date']) {

            }
        }
    }
    inputValueChanged(event: any) {
        //console.log("inputValueChanged:"+event);
        if (event && event.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
            let dt = new Date(Date.parse(event))
            if (dt && dt.getTime() > 0) {
                this.updateModel(dt);
                this.onChange.emit(this.date);
            }
        }
    }
    onToggle(event: any) {
        mwDatetimeComponent = this;
        if (event) {
            window.document.addEventListener('click', this.documentClick, true);
        } else {
            window.document.removeEventListener('click', this.documentClick, true);
        }
    }

    dateSelectionDone(event: any) {
        //console.log("dateSelectionDone:"+event);
        this.updateModel(event);
        this.onChange.emit(this.date);
        this.closeDropdown();
    }

    documentClick(ev: any) {
        //this.closeDropdown();
        if (mwDatetimeComponent) {
            if (!mwDatetimeComponent.el.contains(ev.target)) {
                mwDatetimeComponent.isOpen = false;
                mwDatetimeComponent = null;
            }
        }
    }

    closeDropdown() {
        this.isOpen = false;
        window.document.removeEventListener('click', this.documentClick, true);
    }

    writeValue(value: any): void {
        this.updateModel(value);
    }

    registerOnChange(fn: (_: any) => void): void {
        //this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        //this.onTouched = fn;
    }

    ngOnDestroy() {
        window.document.removeEventListener('click', this.documentClick, true);
        mwDatetimeComponent = null;
    }

    private init() {

    }
    private updateModel(dt: Date) {
        if (dt && moment.isDate(dt)) {
            this.date = dt;
            this.inputValue = moment(this.date).format("YYYY-MM-DD");
        }
    }
}
