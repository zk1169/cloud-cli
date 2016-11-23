// Observable Version
import { Injectable } from '@angular/core';

import { StoreModel } from '../models/store.model';
import { EmployeeModel } from '../models/employee.model';
//import { environment } from '../index';
import { MerchantType,CardType } from '../models/mw.enum';
import { QueryTagModel } from '../models/query-tag.model';
import { MemberType } from '../models/mw.enum';


@Injectable()
export class UserService {
    isLoggedIn: boolean = false;
    // store the URL so we can redirect after logging in
    redirectUrl: string;
    empInfo: EmployeeModel;
    permissionCodeList: any[] = [];
    permissionStoreList: StoreModel[] = [];

    private cache:any;
    constructor() {
        this.cache = {};
    }

    get merchantType():MerchantType{
        if(this.empInfo){
            return this.empInfo.merchantType;
        }else{
            return MerchantType.PROFESSIONAL;
        }
    }

    get firstRoute():string{
        let _firstRoute :string;
        switch(this.merchantType){
            case MerchantType.LITE:
                _firstRoute = "/dashboard-lite/";
                break;
            case MerchantType.PROFESSIONAL:
            default:
                _firstRoute = "/dashboard-pro/";
                break;
        }
        return _firstRoute;
    }

    get cardTypeQueryTagList(){
        let cardTypeQueryTagList:QueryTagModel[] = [];
        cardTypeQueryTagList.push(new QueryTagModel(null,"全部"));
        cardTypeQueryTagList.push(new QueryTagModel(+CardType.DISCOUNT,'折扣卡'));
        cardTypeQueryTagList.push(new QueryTagModel(+CardType.CASH,'储值卡'));
        cardTypeQueryTagList.push(new QueryTagModel(+CardType.TIME,'时段卡'));
        cardTypeQueryTagList.push(new QueryTagModel(+CardType.TIMES_TOTAL,'疗程总次卡'));
        cardTypeQueryTagList.push(new QueryTagModel(+CardType.TIMES,'疗程分次卡'));
        return cardTypeQueryTagList;
    }

    get cardTypeList(){
        let cardTypeQueryTagList:QueryTagModel[] = [];
        cardTypeQueryTagList.push(new QueryTagModel(+CardType.DISCOUNT,'折扣卡'));
        cardTypeQueryTagList.push(new QueryTagModel(+CardType.CASH,'储值卡'));
        cardTypeQueryTagList.push(new QueryTagModel(+CardType.TIME,'时段卡'));
        cardTypeQueryTagList.push(new QueryTagModel(+CardType.TIMES_TOTAL,'疗程总次卡'));
        cardTypeQueryTagList.push(new QueryTagModel(+CardType.TIMES,'疗程分次卡'));
        return cardTypeQueryTagList;
    }

    get storeQueryTagList(){
        let storeQueryTagList:QueryTagModel[] = [];
        storeQueryTagList.push(new QueryTagModel(null,"全部"));
        if(this.permissionStoreList && this.permissionStoreList.length > 0){
            this.permissionStoreList.forEach((item:any,index:number)=>{
                storeQueryTagList.push(new QueryTagModel(item.id,item.name));
            });
        }
        return storeQueryTagList;
    }

    get storeSelectList(){
        let selectList:any[] = [];
        if(this.permissionStoreList && this.permissionStoreList.length > 0){
            this.permissionStoreList.forEach((item:any,index:number)=>{
                selectList.push({value:item.id,name:item.name});
            });
        }
        return selectList;
    }

    get storeMwSelectList(){
        // let selectList:any[] = [{value:undefined,name:''}];
        let selectList:any[] = [];
        if(this.permissionStoreList && this.permissionStoreList.length > 0){
            this.permissionStoreList.forEach((item:any,index:number)=>{
                selectList.push({id:item.id,text:item.name});
            });
        }
        return selectList;
    }

    get storeList(){
        return this.permissionStoreList;
    }

    get memberTypeList():{ name: string, value: MemberType }[]{
        return [
            { name: "散客消费", value: MemberType.IDLE_MEMBER },
            { name: "会员消费", value: MemberType.MEMBER }
        ];
    }

    getStoreById(storeId:number){
        let storeCopy:StoreModel;
        if(this.permissionStoreList && this.permissionStoreList.length > 0){
            this.permissionStoreList.forEach((item:any,index:number)=>{
                if(item.id == storeId){
                    storeCopy = item;
                    return;
                }
            });
        }
        return storeCopy;
    }

    getStoreNameById(storeId:number){
        let store = this.getStoreById(storeId);
        if(store){
            return store.name;
        }else{
            return '';
        }
    }

    get roomList(){
        return [
            {id:1,text:'VIP1'},
            {id:2,text:'VIP2'},
            {id:3,text:'VIP3'},
        ];
    }

    //---------------------------------
    //缓存机制
    //---------------------------------
    HTTP_CACHE_GET_IP:string = 'HTTP_CACHE_GET_IP';
    HTTP_CACHE_GET_ALL_PAY_ITEM:string = 'HTTP_CACHE_GET_ALL_PAY_ITEM_{0}';
    HTTP_CACHE_GET_ALL_ITEM:string = 'HTTP_CACHE_GET_ALL_ITEM_{0}';
    HTTP_CACHE_GET_ALL_ITEM_TYPE:string = 'HTTP_CACHE_GET_ALL_ITEM_TYPE';
    HTTP_CACHE_GET_ALL_TREE_MODEL_ITEM:string = 'HTTP_CACHE_GET_ALL_TREE_MODEL_ITEM_{0}';
    HTTP_CACHE_SEARCH_MEMBER_FIRST:string = 'HTTP_CACHE_SEARCH_MEMBER_FIRST';
    HTTP_CACHE_SEARCH_EMPLOYEE_FIRST:string = 'HTTP_CACHE_SEARCH_EMPLOYEE_FIRST';

    getCache(key:string){
        if(key && this.cache[key]){
            return this.cache[key].cacheValue;
        }else{
            return null;
        }
    }
    setCache(key:string,value:any){
        if(key){
            //this.cache[key] = value;
            this.cache[key] = new MwCache(key,value);
        }
    }
    clearAllCache(){
        this.cache = {};
    }
    clearCacheByKey(key:string){
        delete this.cache[key];
    }

}

class MwCache{
    //设置缓存的时间
    private timespan:number;
    
    private value:any;
    private key:string;

    //缓存失效时间
    static timeout:number = 1000*60*10;

    constructor(key:string,value:any){
        this.timespan = new Date().getTime();
        this.key = key;
        this.value = value;
    }
    get cacheValue(){
        let currentTimespan = new Date().getTime();
        console.log(this.key + ' from cache time :'+(currentTimespan - this.timespan)/1000+'s');
        if(currentTimespan - this.timespan < MwCache.timeout){
            return this.value;
        }else{
            return null;
        }
    }
}
