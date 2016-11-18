import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';
import { 
    ItemBaseComponent,
    CardService,
    UserService,
    EventBus,
    MerchantType,
    QueryTagModel,
    CardBaseModel,
    CardType,
    SortModel,
    MwLoadingBarService
} from '../../../shared/index';

@Component({
    selector: 'mw-card-list',
    templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.scss']
})
export class CardListComponent extends ItemBaseComponent implements OnInit, OnDestroy {
    private routeSubscribe: any;
    private queryCardType:CardType;
    private cardTypeList:QueryTagModel[];
    private editCardItem:CardBaseModel;
    private nameSortModel:SortModel;
    @ViewChild('editModal') editModal:ModalDirective;

    constructor(
        private cardService: CardService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        userService: UserService,
        eventBus: EventBus,
        slimLoader: MwLoadingBarService
    ) {
        super(userService,slimLoader, eventBus);
        this.cardTypeList = userService.cardTypeQueryTagList;
        this.nameSortModel = new SortModel('name','');
    }

    ngOnInit() {
        this.routeSubscribe = this.activatedRoute.params.subscribe(params => {
            this.searchText = params['keyword'];
            this.queryStoreId = +params['store'];
            this.queryCardType = <CardType>(+params['type']);
            let page = +params['page'];
            if (!page) {
                page = 1;
            }
            this.getList(page, this.searchText,this.queryStoreId,this.queryCardType,this.sortList);
        });
    }
    doSearch(event: any) {
        this.navigate(1,event.searchText,this.queryStoreId,this.queryCardType);
    }
    addClick() {
        this.editClick(null);
    }
    editClick(item:CardBaseModel){
        this.editCardItem = item;
        this.editModal.show();
    }
    hideModal(ev:CardBaseModel){
        if(ev){
            for(let i in this.itemList){
                if(ev.id == this.itemList[i].id){
                    this.itemList[i] = ev;
                    this.itemList[i].changed = true;
                    break;
                }
            }
        }
        this.editModal.hide();
    }
    pageChanged(event: any): void {
        this.navigate(event.page,this.searchText,this.queryStoreId,this.queryCardType);
    };
    storeChanged(event:QueryTagModel){
        this.navigate(1,this.searchText,event.value,this.queryCardType);
    }
    cardTypeChanged(event:QueryTagModel){
        this.navigate(1,this.searchText,this.queryStoreId,event.value);
    }
    onSortChanged(ev:SortModel){
        this.getList(1, this.searchText,this.queryStoreId,this.queryCardType,this.sortList);
    }

    ngOnDestroy() {
        this.routeSubscribe.unsubscribe();
    }

    private navigate(page:number,searchText ? : string,storeId?:number,cardType?:CardType){
        let navigationExtras: any = { page: page };
        if (searchText && searchText.length > 0) {
            navigationExtras.keyword = searchText;
        }
        if(storeId && storeId>0){
            navigationExtras.store = storeId;
        }
        if(cardType){
            navigationExtras.type = cardType;
        }
        this.router.navigate([this.userService.firstRoute + "card-list" , navigationExtras]);
    }

    private getList(page: number, searchText ? : string,storeId?:number,cardType?:CardType,sortList?:SortModel[]) {
    //private getList(options:{page: number, searchText: string,storeId:number,cardType:CardType,sortList:SortModel[]}) {  
        let options:any = {
            page:page,
            keyword:searchText,
            storeId:storeId,
            cardType:cardType,
            sortList:sortList,
            size:this.itemsPerPage
        };
        this.startSlimLoader();
        this.cardService.getList(options)
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

    get sortList(){
        let sortList:SortModel[] = [];
        if(this.nameSortModel){
            sortList.push(this.nameSortModel);
        }
        return sortList;
    }

}
