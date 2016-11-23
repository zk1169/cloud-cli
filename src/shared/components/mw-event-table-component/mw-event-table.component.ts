import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnChanges,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ViewChild,
    ElementRef,
    HostListener
} from '@angular/core';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';

import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { TableEmployeeModel } from '../../models/table-employee.model';
import { AppointOrderTableModel } from '../../models/appoint-order.model';

const SEGMENT_HEIGHT: number = 30;

@Component({
    selector: 'mw-event-table',
    templateUrl: './mw-event-table.component.html',
    styleUrls: ['./mw-event-table.component.scss']
})
export class MwEventTableComponent implements OnChanges {

    @ViewChild('tableContent') tableContent:ElementRef;
    @Input() date                : Date;
    @Input() columns             : TableEmployeeModel[] = [];
    @Input() hourSegments        : number               = 2;
    @Input() dayStartHour        : number               = 0;
    @Input() dayStartMinute      : number               = 0;
    @Input() dayEndHour          : number               = 24;
    @Input() dayEndMinute        : number               = 0;
    @Input() eventWidth          : number               = 150;
    //@Input() refresh           : Subject < any > ;
    @Output() eventClicked       : EventEmitter < any > = new EventEmitter();
    @Output() hourSegmentClicked : EventEmitter < any > = new EventEmitter();
    private hours                : any[]                = [];
    //private view               : DayView;
    //private width              : number               = 0;
    //private refreshSubscription: Subscription;
    private showEventDetail      : boolean              = false;
    private eventDetailWrap      : any                  = {};
    private selectedOrder        : AppointOrderTableModel;
    private colWidth             : number;

    constructor(private cdr: ChangeDetectorRef) {}

    @HostListener('window:resize')
    resizeColWidth(){
        console.log('resizeColWidth');
        this.colWidth = this.tableContent.nativeElement.clientWidth/this.columns.length;
    }

    ngOnInit(): void {
        // if (this.refresh) {
        //     this.refreshSubscription = this.refresh.subscribe(() => {
        //         this.refreshAll();
        //         this.cdr.markForCheck();
        //     });
        // }
    }

    ngAfterViewInit(){
        //this.resizeColWidth();
    }

    ngOnDestroy(): void {
        // if (this.refreshSubscription) {
        //     this.refreshSubscription.unsubscribe();
        // }
    }

    ngOnChanges(changes: any): void {
        if (changes.date) {
            this.refreshHourGrid();
        }

        if (
            changes.date ||
            changes.events ||
            changes.dayStartHour ||
            changes.dayStartMinute ||
            changes.dayEndHour ||
            changes.dayEndMinute ||
            changes.eventWidth ||
            changes.columns
        ) {
            this.closeEventDetailWrap();
            this.refreshView();
        }
    }

    onDropSuccess(ev:any,employee:any){
        //debugger;
    }

    eventClick(ev:any,order:AppointOrderTableModel,index:number){
        ev.stopPropagation();
        this.selectedOrder = order;
        let left = parseInt(ev.currentTarget.style.marginLeft);
        if(!left){
            left = 0;
        }
        let width = ev.currentTarget.clientWidth+14;
        let parentWidth = ev.currentTarget.parentElement.clientWidth;
        this.eventDetailWrap.left = left+width+parentWidth*index-3;
        this.eventDetailWrap.top = parseInt(ev.currentTarget.style.top);
        this.showEventDetail = !this.showEventDetail;
    }
    eventEmptyClick(){
        this.showEventDetail = false;
    }
    closeEventDetailWrap(){
        this.showEventDetail = false;
    }

    get totalOrderCount(){
        let total = 0;
        this.columns.forEach((item:any,index:number)=>{
            if(item.appointOrderList){
                total+=item.appointOrderList.length;
            }
        });
        return total;
    }

    private trackByItem(index: number, obj: any): any {
        return obj.id;
    }

    private refreshHourGrid(): void {
        this.hours = this.getDayViewHourGrid({
            viewDate: this.date,
            hourSegments: this.hourSegments,
            dayStart: {
                hour: this.dayStartHour,
                minute: this.dayStartMinute
            },
            dayEnd: {
                hour: this.dayEndHour,
                minute: this.dayEndMinute
            }
        });
    }

    private getDayViewHourGrid(options:any){
        let hours:any[] = [];
        for (let i = options.dayStart.hour; i < options.dayEnd.hour; i++) {
            let hourItem:any = {segments:[]};
            for(let j = 0;j<options.hourSegments;j++){
                let isStart:boolean = (j==0?true:false);
                let dateMoment = moment(options.viewDate).hour(i).minute(j*60/options.hourSegments);
                hourItem.segments.push({isStart:isStart,date:dateMoment});
            }
            hours.push(hourItem);
        }
        return hours;
    }

    private refreshView(): void {
        this.resizeColWidth();
        if (this.columns && this.columns.length > 0) {
            // for(let i in this.columns){
            //   if(this.columns[i].)
            // }
            var _this = this;
            // this.columns.forEach(function(item, index) {
            //     if (item.appointOrderList) {
            //         let startIndex:number = 0;
            //         let endIndex:number = 0;
            //         item.appointOrderList.forEach(function(orderItem, index) {
            //             if(lastItem){

            //             }else{
            //                 lastItem = orderItem;
            //             }
            //               orderItem.left = 0;
            //               orderItem.width = 0;
            //         });
            //     }
            // });
        }
    }

    private refreshAll(): void {
        this.refreshHourGrid();
    }

}
