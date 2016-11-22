export interface IFloat{
	floatOKClick(answer:any,floatName?:string):any;
}

export interface IDialog{
	dialogName:string;
	dialogArgs:any;
	dialogOKClick(answer:any):any;
	dialogCancelClick(answer:any):any;
}