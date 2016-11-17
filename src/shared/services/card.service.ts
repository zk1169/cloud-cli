// Observable Version
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { UserService } from './user.service';
import { CardBaseModel } from '../models/card.model';
import { CardType } from '../models/mw.enum';
import { SortModel } from '../models/sort.model';

@Injectable()
export class CardService {
    constructor(private httpService: HttpService,private userService: UserService) {}

    getList(options:{storeId: number,keyword:string, cardType:CardType,page: number, size: number, sortList:SortModel[]}) {
        let data:any = {
            page: options.page,
            size: options.size,
            query: [
                { field: "merchantId", value: this.userService.empInfo.merchant.id+"" }
            ]
        };
        if(options.storeId){
            data.query.push({ field: "storeId", value: options.storeId+"" });
        }
        if(options.keyword){
            data.query.push({ field: "keyword", value: options.keyword });
        }
        if(options.cardType){
            data.query.push({field:"type",value:options.cardType+''});
        }
        if(options.sortList){
            data.sort = [];
            options.sortList.forEach((item:SortModel)=>{
                if(item && item.hasSort){
                    data.sort.push(item.unserializer());
                }
            });
        }

        return this.httpService.request('/api/cardDefine/searchCardDefines', 'post', data)
            .map((res) => {
                let result: any = {};
                result.rows = [];
                if (res) {
                    result.totalItems = res.total;
                    if (res.rows && res.rows.length > 0) {
                        for (let i in res.rows) {
                            if (res.rows[i]) {
                                let cardModel = CardBaseModel.serializer(res.rows[i]);
                                result.rows.push(cardModel);
                            }
                        }
                    }
                }
                return result;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    getById(cardId:number){
        if(!cardId || cardId <= 0){
            return Observable.of(new CardBaseModel(CardType.DISCOUNT));
        }
        return this.httpService.request('/api/cardDefine/'+cardId, 'get', null)
            .map((res) => {
                return CardBaseModel.serializer(res,this.userService);
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    save(model:CardBaseModel){
        if(!model){
            return Observable.of(false);
        }
        let method:string;
        if(model.id && model.id > 0){
            method = "put";
        }else{
            method = "post";
        }
        return this.httpService.request('/api/cardDefine', method, model.unserializer())
            .map((res) => {
                return res;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }
}
