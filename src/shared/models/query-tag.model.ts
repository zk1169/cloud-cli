export class QueryTagModel {
    name:string;
    value:any;
    selected:boolean;
    constructor(value:any,name:string){
        this.value = value;
        this.name = name;
    }
}