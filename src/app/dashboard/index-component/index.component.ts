import { Component, OnInit, OnDestroy } from '@angular/core';

//import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { Observable } from 'rxjs/Observable';
import {
    BaseComponent,
    EventBus,
    UserService,
    MwLoadingBarService,
    MwDragDropService,
    CommonService
} from '../../../shared/index';

@Component({
    selector: 'mw-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    providers:[MwDragDropService]
})
export class IndexComponent extends BaseComponent implements OnInit, OnDestroy {
    constructor(
        private commonService:CommonService,
        eventBus: EventBus,
        slimLoader: MwLoadingBarService
    ) {
        super(slimLoader, eventBus);
    }
    // lineChart
    public lineChartData: Array<any> = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartType: string = 'line';
    public pieChartType: string = 'pie';

    // Pie
    public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
    public pieChartData: number[] = [300, 500, 100];

    public randomizeType(): void {
        this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
        this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
    }

    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    ngOnInit() {
        this.commonService.getIP()
            .subscribe(
                (res) => {
                },
                (error) => {
                    this.eventNotice("alert.message", error);
                }
            );
    }

    ngOnDestroy() {
    }

}
