// Observable Version
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

import { HttpService } from './http.service';
import { UserService } from './user.service';
import { TreeModel } from '../models/tree.model';
import { OrderItemModel } from '../models/order-item.model';
import { IPay,BasePayModel } from '../models/pay.interface';
import { MwTool } from '../models/mw-tool.model';


@Injectable()
export class CommonService {

    constructor(private httpService: HttpService,private userService: UserService) {}

    getAllItemType(mchId: number) {
        return this.httpService.requestCache('/api/order/initItemCategory/'+mchId, 'get', null,this.userService.HTTP_CACHE_GET_ALL_ITEM_TYPE)
            .map((res) => {
                let result: TreeModel = TreeModel.createRootNode('全店通用');
                if(res.SERVICE_ITEM && res.SERVICE_ITEM.length > 0){
                    res.SERVICE_ITEM.forEach((item:any,index:number)=>{
                        if(item){
                            result.children.push(new TreeModel().serializer(item,result));
                        }
                    });
                }
                //this.userService.setCache(cacheKey,result);
                return result;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });

        //let cacheKey = MwTool.format(this.userService.HTTP_CACHE_GET_ALL_ITEM_TYPE,storeId);
        // if(this.userService.getCache(cacheKey)){
        //     return Observable.of(this.httpService.getCache(cacheKey));
        // }else{
        //     return this.httpService.request('/api/order/initItemCategory/'+mchId, 'get', null)
        //         .map((res) => {
        //             let result: TreeModel = TreeModel.createRootNode();
        //             if(res.SERVICE_ITEM && res.SERVICE_ITEM.length > 0){
        //                 res.SERVICE_ITEM.forEach((item:any,index:number)=>{
        //                     if(item){
        //                         result.children.push(new TreeModel().serializer(item,result));
        //                     }
        //                 });
        //             }
        //             this.userService.setCache(cacheKey,result);
        //             return result;
        //         })
        //         .catch((error: any) => {
        //             return Observable.throw(error);
        //         });
        // }
    }

    //券   卡   套餐  项目 产品 "11111"
    getAllItem(mchId: number,storeId:number,memberId:number,itemSwitch:string) {
        let cacheKey = MwTool.format(this.userService.HTTP_CACHE_GET_ALL_ITEM,storeId);
        let url = '/api/order/initItems/'+mchId+'/'+storeId+'/'+itemSwitch;
        if(memberId){
            url += '/'+memberId;
        }
        return this.httpService.requestCache(url, 'get', null,cacheKey)
            .map((res) => {
                let result: OrderItemModel[] = [];
                if(res.SERVICE_ITEM && res.SERVICE_ITEM.length > 0){
                    res.SERVICE_ITEM.forEach((item:any,index:number)=>{
                        if(item){
                            item.itemType = item.saleType;
                            //delete item.saleType;
                            result.push(new OrderItemModel().serializer(item));
                        }
                    });
                }
                return result;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    //券   卡   套餐  项目 产品 "11111"
    getAllTreeModelItem(storeId:number,itemSwitch:string) {
        let cacheKey = MwTool.format(this.userService.HTTP_CACHE_GET_ALL_TREE_MODEL_ITEM,storeId);
        let data = {
            needData:itemSwitch
        }
        return this.httpService.requestCache('/api/servicePackage/selectTree', 'post', data,cacheKey)
            .map((res) => {
                res.name = '全店通用';
                return new TreeModel().serializer(res,null)
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getAllPayItem(mchId: number,storeId:number,memberId:number) {
        let cacheKey = MwTool.format(this.userService.HTTP_CACHE_GET_ALL_PAY_ITEM,storeId);
        let data:any = {
            merchantId:mchId,
            storeId:storeId
        }
        if(memberId){
            data.memberId = memberId;
        }
        return this.httpService.requestCache('/api/order/getPayMethods', 'post', data,cacheKey)
            .map((res) => {
                let result: IPay[] = [];
                if(res && res.length > 0){
                    res.forEach((item:any,index:number)=>{
                        if(item){
                            if(item.payDetails && item.payDetails.length > 0){
                                item.payDetails.forEach((sub_item:any,index:number)=>{
                                    if(sub_item){
                                        sub_item.parentCode = item.code;
                                        if(item.code == 31){
                                            //设置钱包支付的sub_item的name和code
                                            //因为钱包支付的payDetails中没有name和code字段
                                            sub_item.name = item.name;
                                            sub_item.code = item.code;
                                        }else if(item.code == 50){
                                            sub_item.name = sub_item.storeActivitiesName;
                                            sub_item.code = item.code;
                                        }
                                        result.push(BasePayModel.serializer(sub_item));
                                    }
                                });
                            }else if([10,20,31,40,41,42,70,71,72].indexOf(item.code)>-1 || item.code >= 100){
                                item.parentCode = item.code;
                                result.push(BasePayModel.serializer(item));
                            }
                        }
                    });
                }
                return result;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getAllItemAndItemType(mchId: number,storeId:number,memberId:number,itemSwitch:string){
        return Observable.merge(this.getAllItemType(mchId),this.getAllItem(mchId,storeId,memberId,itemSwitch))
            .reduce((res1: any, res2: any) => {
                    let result:any[] = [];
                    if(res1 && res1 instanceof TreeModel){
                        result.push(res2);
                        result.push(res1);
                    }else{
                        result.push(res1);
                        result.push(res2);
                    }
                    return result;
                })
                .catch((error: any) => {
                    return Observable.throw(error);
                });
    }
}
