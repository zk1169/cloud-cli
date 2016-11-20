// Observable Version
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { UserService } from './user.service';
import { MemberModel } from '../models/member.model';


@Injectable()
export class MemberService {
    constructor(private httpService: HttpService,private userService: UserService) {}

    getMemberList(keyword:string, page: number, size: number) {
        let mchId = this.userService.empInfo.merchant.id+"";
        let storeId = this.userService.empInfo.storeId;
        let data:any = {
            page: page,
            size: size,
            query: [
                { field: "merchantId", value: mchId+"" }
            ]
        };
        // if(storeId){
        //     data.query.push({ field: "storeId", value: storeId+"" });
        // }
        let cacheKey:string;
        if(keyword){
            data.query.push({ field: "keyword", value: keyword,operation: "like" });
        }else{
            cacheKey = this.userService.HTTP_CACHE_SEARCH_MEMBER_FIRST;
        }

        return this.httpService.requestCache('/api/member/bill/list/search', 'post', data,cacheKey)
            .map((res) => {
                let result: any = {};
                result.rows = [];
                if (res) {
                    result.totalItems = res.total;
                    if (res.rows && res.rows.length > 0) {
                        for (let i in res.rows) {
                            if (res.rows[i]) {
                                result.rows.push(new MemberModel().serializer(res.rows[i]));
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
}
