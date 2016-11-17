// Observable Version
import { Injectable } from '@angular/core';
//import {  Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
//import 'rxjs/add/operator/take';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/switchMap';

import { AuthModel } from '../models/auth.model';
import { HttpService } from './http.service';
import { UserService } from './user.service';
import { StoreModel } from '../models/store.model';
import { EmployeeModel } from '../models/employee.model';


@Injectable()
export class AuthService {
    //isLoggedIn: boolean = false;
    // store the URL so we can redirect after logging in
    //redirectUrl: string;
    //empInfo: EmployeeModel;
    //permissionCodeList: any[] = [];
    //permissionStoreList: StoreModel[] = [];

    constructor(private httpService: HttpService,private userService:UserService) {}

    public login(model: AuthModel) {
        let data = {
            username: model.userName,
            password: this.base64encode(model.password),
            rememberMe: model.autoLogin
        };
        return this.httpService.request('/api/auth/form', 'post', data)
            // .map((res)=>{
            //     debugger;
            //     self.get_employee_list(res,self);
            // })
            .switchMap((res) => this.getEmployeeList(res))
            .catch((error: any) => {
                this.userService.isLoggedIn = false;
                return Observable.throw(error);
            });
        //return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
    }

    public logout() {
        this.httpService.request('/api/auth', 'delete', null)
        this.userService.isLoggedIn = false;
        window.localStorage.clear();
    }

    public getPermission(empId?: number) {
        // var timer1 = Observable.interval(1000).take(10);
        // var timer2 = Observable.interval(2000).take(6);
        // var timer3 = Observable.interval(500).take(10);
        // var concurrent = 2; // the argument
        // //var merged = Observable.merge(timer1, timer2, timer3, concurrent);
        // var merged = Observable.merge(timer1,timer3,1);
        // merged.subscribe(x => console.log(x));

        //let self = this;
        if(!empId && this.userService.empInfo){
            empId = this.userService.empInfo.id;
        }
        return Observable.merge(this.getPermissionStoreList(empId), this.getPermissions(empId))
            .reduce((res1: any[], res2: any[]) => {
                if(res1 && res1.length > 0 && res1[0] instanceof StoreModel){
                    this.userService.permissionStoreList = [];
                    res1.forEach((item:any,index:number)=>{
                        this.userService.permissionStoreList.push(new StoreModel().serializer(item));
                    });
                    this.userService.permissionCodeList = res2;
                }else{
                    if(res2 && res2.length > 0){
                        this.userService.permissionStoreList = [];
                        res2.forEach((item:any,index:number)=>{
                            this.userService.permissionStoreList.push(new StoreModel().serializer(item));
                        });
                    }
                    this.userService.permissionCodeList = res1;
                }
                
                return null;
            })
            .catch((error: any) => {
                return Observable.throw(error);
            });
    }

    public getStoreList(){
        if(this.userService.permissionStoreList && this.userService.permissionStoreList.length > 0){
            // debugger;
            // return Observable.of(1).do(val => {
            //     return this.userService.permissionStoreList;
            // });
            return Observable.of(this.userService.permissionStoreList);
        }else{
            return this.getPermissionStoreList(this.userService.empInfo.id);
        }
    }

    private getPermissions(empId: number) {
        if(!empId && this.userService.empInfo){
            empId = this.userService.empInfo.id;
        }
        return this.httpService.request('/api/employee/permissions/' + empId, 'get', null)
            .map((res) => {
                this.userService.isLoggedIn = true;
                return res;
            })
            .catch((error: any) => {
                this.userService.isLoggedIn = false;
                return Observable.throw(error);
            });
    }

    private getEmployeeList(userId: string) {
        return this.httpService.request('/api/employee/list/account/' + userId, 'get', null)
            .switchMap((res) => this.employeeLogin(res))
            .catch((error: any) => {
                this.userService.isLoggedIn = false;
                return Observable.throw(error);
            });
    }

    private employeeLogin(empList: any) {
        if (empList && empList.length > 0) {
            this.userService.empInfo = new EmployeeModel().serializer(empList[0]);
            //window.localStorage.setItem('emp_info', JSON.stringify(this.empInfo));
        } else {
            return Observable.throw("获取员工身份失败");
        }

        return this.httpService.request('/api/employee/login/' + this.userService.empInfo.id, 'put', null)
            .map((res) => {
                this.userService.isLoggedIn = true;
                window.localStorage.setItem('emp_info', JSON.stringify(empList[0]));
                return res;
            })
            .catch((error: any) => {
                this.userService.isLoggedIn = false;
                return Observable.throw(error);
            });
    }

    private getPermissionStoreList(empId: number) {
        //var self = this;
        return this.httpService.request('/api/employee/permissionStores/' + empId, 'get', null)
            .map((res) => {
                this.userService.permissionStoreList = [];
                var self = this;
                res.forEach(function(store:any,index:number){
                    self.userService.permissionStoreList.push(new StoreModel().serializer(store));
                });
                return this.userService.permissionStoreList;
            })
            .catch((error: any) => {
                this.userService.isLoggedIn = false;
                return Observable.throw(error);
            });
    }

    private base64encode(str: string) {
        let base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let out: any, i: any, len: any;　　
        let c1: any, c2: any, c3: any;　　
        len = str.length;　　
        i = 0;　　
        out = "";　　
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {　　
                out += base64EncodeChars.charAt(c1 >> 2);　　
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);　　
                out += "==";　　
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {　　
                out += base64EncodeChars.charAt(c1 >> 2);　　
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));　　
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);　　
                out += "=";　　
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);　　
        }　　
        return out;
    }
}
