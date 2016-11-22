import { IFloat } from './dialog.interface';

export class FloatDialogModel{
	parent:IFloat;
	left:number;
	top:number;
	show:boolean;
	args:any;

	constructor(parent:IFloat,element:any,args?:any){
		this.parent = parent;
		this.args = args;
		let position:ClientRect;

		position = element.getBoundingClientRect();
        this.left = position.left;
        //this.top = position.top + document.body.scrollTop;
        //this.bottom = position.bottom;
        if(document.body.scrollHeight > document.body.scrollTop + position.top+350){
        	this.top = position.top + document.body.scrollTop;
        }else{
        	this.top = document.body.scrollHeight - 350;
        }
		this.show = true;
	}
}