import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    OnInit,
    OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PaginationBaseComponent } from '../../models/base.component';
import { FloatDialogModel } from '../../models/float-dialog.model';
import { OrderItemModel } from '../../models/order-item.model';
import { TreeModel } from '../../models/tree.model';
import { ServiceItemService } from '../../services/service-item.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';
import { MwTool } from '../../models/mw-tool.model';

let selecteItemComponent :MwSelectItemComponent;

@Component({
    selector: 'mw-select-item',
    templateUrl: './mw-select-item.component.html',
    styleUrls: ['./mw-select-item.component.scss']
})
export class MwSelectItemComponent extends PaginationBaseComponent implements OnInit,OnDestroy {
    @Input() floatDialogModel:FloatDialogModel;
    //@Output() itemSelectedEvent:EventEmitter<Object> = new EventEmitter();

    private el: HTMLElement;
    private loading:Observable<Object>;
    private itemTypeTree:TreeModel;
    private searchText:string;

    constructor(el: ElementRef, private commonService:CommonService,private userService:UserService) {
        super();
        this.el = el.nativeElement;
        selecteItemComponent = this;
        window.document.addEventListener('click', this.documentClick, true);
    }

    ngOnInit(){
        this.loading = this.commonService.getAllItemAndItemType(this.userService.empInfo.merchant.id,this.floatDialogModel.args.storeId,this.floatDialogModel.args.memberId,'00010')
            .map(
                (res:any)=>{
                    this.itemList = res[0];
                    this.itemTypeTree = res[1];
                    return true;
                },
                (err:any)=>{Observable.throw(err)}
            );
    }

    doSearch(event: any) {
        //console.log('searchText:' + event.searchText);
        this.searchText = event.searchText;
    }

    selectItem(item:any){
        if(this.floatDialogModel){
            let cloneItem = MwTool.cloneDeep(item);
            cloneItem.count = 1;
            cloneItem.totalMoney = cloneItem.price * cloneItem.count;
            this.floatDialogModel.parent.floatOKClick(cloneItem);
            this.floatDialogModel.show = false;
        }
    }
    documentClick(ev:any){
        if (selecteItemComponent) {
            if (!selecteItemComponent.el.contains(ev.target)) {
                selecteItemComponent.floatDialogModel.show = false;
                selecteItemComponent = null;
            }
        }
    }

    ngOnDestroy() {
        window.document.removeEventListener('click', this.documentClick, true);
        selecteItemComponent = null;
    }
}    
