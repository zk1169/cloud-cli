import { Injectable } from '@angular/core';
import 'sweetalert2/dist/sweetalert2.min';
//import { window } from '@angular/platform-browser/src/facade/browser';

//import * as assign from 'lodash.assign';
let assign = require("lodash.assign");

@Injectable()
export class SweetAlertService {
  private confirmButtonColor:string = '#B54DCE';
  constructor() {}

  // swal() {
  //   return window.swal(...arguments);
  // }

  prompt(options:any) {
    const baseOptions:any = {
      showCancelButton: true,
      confirmButtonText: 'Submit',
      input: 'text'
    };
    return window['swal'](assign(baseOptions, options));
  }

  confirm(options:any) {
    const baseOptions:any = {
      showCancelButton: true,
      confirmButtonColor:this.confirmButtonColor,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i>&nbsp;确定',
      cancelButtonText:'<i class="fa fa-thumbs-down"></i>&nbsp;取消',
      type: 'warning'
    };
    return window['swal'](assign(baseOptions, options));
  }

  alert(options:any) {
    const baseOptions:any = {
      confirmButtonText: 'OK',
      type: 'info',
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
    };
    //return window.swal(baseOptions);
    return window['swal'](assign(baseOptions, options));
  }

  question(options:any) {
    return this.alert(assign({ type: 'question' }, options));
  }

  success(options:any) {
    return this.alert(assign({ type: 'success' }, options));
  }

  error(options:any) {
    return this.alert(assign({ type: 'error' }, options));
  }

  warn(options:any) {
    return this.alert(assign({ type: 'warn' }, options));
  }

  info(options:any) {
    return this.alert(assign({ type: 'info' }, options));
  }
}
