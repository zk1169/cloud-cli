//import { IPaginationInstance } from 'ng2-pagination';
import { EventBus,MwLoadingBarService } from '../index';
//import { PAGINATION_CONFIG } from '../index';
import { PaginationConfig } from 'ng2-bootstrap/components/pagination/pagination.component';
import { BaseForm } from './base-form.model';
import { QueryTagModel } from './query-tag.model';
import { UserService } from '../services/user.service';
import { MerchantType } from './mw.enum';

export class BaseComponent {
	private slimLoader: MwLoadingBarService;
	private eventBus: EventBus;

    constructor(slimLoader?: MwLoadingBarService,eventBus?: EventBus) {
    	this.slimLoader = slimLoader;
    	this.eventBus = eventBus;
    }

    eventNotice(type:string,message:any){
    	this.eventBus.notifyDataChanged(type, message);
    }

    startSlimLoader() {
    	//this.slimLoader.progress = 30;
        this.slimLoader.start();
    }
    completeSlimLoader() {
    	this.slimLoader.complete();
    }
}

export class FormBaseComponent extends BaseComponent{
    formList:BaseForm<Object>[];
    constructor(slimLoader?: MwLoadingBarService,eventBus?: EventBus) {
        super(slimLoader,eventBus);
    }
}

export class DialogBaseComponent extends BaseComponent{
    dialogName:string;
    dialogArgs:any;

    constructor(slimLoader?: MwLoadingBarService,eventBus?: EventBus) {
        super(slimLoader,eventBus);
    }

    showDialog(type:string,message:any,dialogName:string){
        this.dialogName = dialogName;
        this.eventNotice(type, message);
    }
}

export class PaginationBaseComponent extends BaseComponent implements PaginationConfig {
    //paginationConfig:any = PAGINATION_CONFIG;
    totalItems:number;
    currentPage:number;
    itemList:any;

    maxSize: number = 5;
    itemsPerPage: number = 10;
    boundaryLinks: boolean = true;
    directionLinks: boolean = true;
    firstText: string = "首页";
    previousText: string = "上一页";
    nextText: string = "下一页";
    lastText: string = "末页";
    rotate: boolean = false;
    pageBtnClass:string;

    constructor(slimLoader?: MwLoadingBarService,eventBus?: EventBus) {
    	super(slimLoader,eventBus);
    	//this.currentPage = 1;
    }

    public setPagination(currentPage:number,totalItems:number,itemList:any){
    	this.totalItems = totalItems;
    	this.currentPage = currentPage;
    	this.itemList = itemList;
    	//this.numPages = Math.ceil(this.totalItems/this.paginationConfig.itemsPerPage);
    }
    public clearPagination(){
    	this.totalItems = 0;
    	this.itemList = null;
    }

    public trackByItem(index:number,item:any){
        return item.id;
    }
}

export class ItemBaseComponent extends PaginationBaseComponent{
    routerList:{routerLink:string,routerName:string}[];
    private merchantType:MerchantType;
    storeList:QueryTagModel[];
    searchText: string;
    queryStoreId:number;
    dialogName:string;
    dialogArgs:any;
    userService:UserService;

    constructor(userService:UserService,slimLoader: MwLoadingBarService,eventBus: EventBus) {
        super(slimLoader,eventBus);
        this.userService = userService;
        this.merchantType = this.userService.merchantType;
        this.initRouterLink();
        this.storeList = this.userService.storeQueryTagList;
        this.storeList[0].selected = true;
    }

    private initRouterLink(){
        this.routerList = [];
        switch(this.merchantType){
            case MerchantType.PROFESSIONAL:
                this.routerList.push({routerLink:this.userService.firstRoute+'service-item-list',routerName:'项目'});
                this.routerList.push({routerLink:this.userService.firstRoute+'service-package-list',routerName:'套餐'});
                this.routerList.push({routerLink:this.userService.firstRoute+'product-list',routerName:'产品'});
                this.routerList.push({routerLink:this.userService.firstRoute+'card-list',routerName:'卡'});
                this.routerList.push({routerLink:this.userService.firstRoute+'coupon-list',routerName:'券'});
                break;
            case MerchantType.LITE:
                this.routerList.push({routerLink:this.userService.firstRoute+'service-item-list',routerName:'项目'});
                this.routerList.push({routerLink:this.userService.firstRoute+'product-list',routerName:'产品'});
                this.routerList.push({routerLink:this.userService.firstRoute+'card-list',routerName:'卡'});
                this.routerList.push({routerLink:this.userService.firstRoute+'coupon-list',routerName:'券'});
                break;
        }
    }
}
