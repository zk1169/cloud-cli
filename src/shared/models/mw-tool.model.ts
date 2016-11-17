//import * as clonedeep from 'lodash.clonedeep';
let clonedeep = require('lodash.clonedeep');
export class MwTool {
    static cloneDeep(source:Object){
        return clonedeep(source);
    }

    static format(template:string,...args:any[]){
    	//var args = arguments;
    	return template.replace(/{(\d+)}/g, function(match:any, index:any) { 
    	  return typeof args[index] != 'undefined' ? args[index] : match;
    	});
    }
}