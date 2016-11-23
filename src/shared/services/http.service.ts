// Observable Version
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UserService } from './user.service';

@Injectable()
export class HttpService {
    constructor(private http: Http,private userService: UserService) {}

    //直接请求api，不检查缓存
    request(url: string, method: string, data: any) {
        // if (data) {
        //     data = JSON.stringify(data);
        // }
        if(data && this.userService.empInfo){
            data.operatorId = this.userService.empInfo.id;
            data.operatorName = this.userService.empInfo.name;
            data.merchantId = this.userService.empInfo.merchant.id;
        }
        
        let headers = new Headers({'content-type':'application/json'});
        let options = new RequestOptions({ headers: headers, method: method, body: data });
        return this.http.request(url, options)
            .map(this.extractData)
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    //先检查缓存，如果缓存有，从缓存读取数据，否则请求api
    requestCache(url: string, method: string, data: any,cacheKey:string){
        let cacheValue = this.userService.getCache(cacheKey);
        if(cacheValue){
            return Observable.of(cacheValue);
        }else{
            return this.request(url,method,data)
                .map((res) => {
                    this.userService.setCache(cacheKey,res);
                    return res;
                })
                .catch((error: any) => {
                    return Observable.throw(error);
                });
        }
    }

    private extractData(res: Response) {
        let body = res.json();
        if (body && body.code == "000000") {
            return body.data || {};
        }else if(body && body.ip){
            return body.ip;
        }else {
            if (body && body.message) {
                throw { status: body.code, message: body.message };
            } else {
                throw { status: "500", message: "未知错误" };
            }
        }
    }

}
