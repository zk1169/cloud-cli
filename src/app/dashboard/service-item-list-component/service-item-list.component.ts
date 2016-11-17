import { Component, OnInit, OnDestroy,ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';
import { 
    ItemBaseComponent,
    ServiceItemService,
    UserService,
    EventBus,
    MerchantType,
    IDialog,
    QueryTagModel,
    ServiceItemModel,
    MwLoadingBarService
} from '../../../shared/index';

@Component({
    selector: 'mw-service-item-list',
    templateUrl: './service-item-list.component.html',
    styleUrls: ['./service-item-list.component.scss']
})
export class ServiceItemListComponent extends ItemBaseComponent implements OnInit, OnDestroy {
    private routeSubscribe: any;
    private editServiceItem:ServiceItemModel;
    @ViewChild('editModal') editModal:ModalDirective;

    constructor(
        private serviceItemService: ServiceItemService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        userService: UserService,
        eventBus: EventBus,
        slimLoader: MwLoadingBarService
    ) {
        super(userService,slimLoader, eventBus);
    }

    ngOnInit() {
        this.routeSubscribe = this.activatedRoute.params.subscribe(params => {
            this.searchText = params['keyword'];
            this.queryStoreId = +params['store'];
            let page = +params['page'];
            if (!page) {
                page = 1;
            }
            this.getList(page, this.searchText,this.queryStoreId);
        });
    }

    addClick() {
        this.editClick(null);
    }
    doSearch(event: any) {
        this.navigate(1,event.searchText,this.queryStoreId);
    }
    editClick(item:ServiceItemModel){
        // this.dialogName = "edit-service-item-dialog";
        // this.dialogArgs = item;
        // this.eventNotice('show.modal', this);
        this.editServiceItem = item;
        this.editModal.show();
    }
    hideModal(answer?:ServiceItemModel){
        if(answer){
            answer.changed = true;
        }
        this.editModal.hide();
    }
    pageChanged(event: any): void {
        this.navigate(event.page,this.searchText);
    };
    storeChanged(event:QueryTagModel){
        this.navigate(1,this.searchText,event.value);
    }

    ngOnDestroy() {
        this.routeSubscribe.unsubscribe();
    }

    private navigate(page:number,searchText ? : string,storeId?:number){
        let navigationExtras: any = { page: page };
        if (searchText && searchText.length > 0) {
            navigationExtras.keyword = searchText;
        }
        if(storeId && storeId>0){
            navigationExtras.store = storeId;
        }
        this.router.navigate([this.userService.firstRoute + "service-item-list" , navigationExtras]);
    }

    private getList(page: number, searchText ? : string,storeId?:number) {
        this.startSlimLoader();
        this.serviceItemService.getList(storeId, searchText, page, this.itemsPerPage)
            .subscribe(
                (res) => {
                    this.setPagination(page, res.totalItems, res.rows);
                    this.completeSlimLoader();
                },
                (error) => {
                    this.eventNotice("alert.message", error);
                    this.completeSlimLoader();
                }
            );
    }

}
