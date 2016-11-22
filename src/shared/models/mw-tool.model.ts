//import * as clonedeep from 'lodash.clonedeep';
let clonedeep = require('lodash.clonedeep');
let assign = require("lodash.assign");

export class MwTool {
	//对象深复制
    static cloneDeep(source:Object){
        return clonedeep(source);
    }

    //格式化字符串
    static format(template:string,...args:any[]){
    	//var args = arguments;
    	return template.replace(/{(\d+)}/g, function(match:any, index:any) { 
    	  return typeof args[index] != 'undefined' ? args[index] : match;
    	});
    }

    //复制option对象的属性到baseOption
    //如果同名的属性则覆盖base中的属性
    static assign(baseOption:any,option:any){
    	return assign(baseOption,option);
    }
}