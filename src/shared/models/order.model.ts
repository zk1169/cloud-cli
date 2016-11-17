import { BaseModel,ISerializer } from './base.model';
import { MemberModel } from './member.model';
import { OrderType,OrderSource,OrderStatus } from '../models/mw.enum';
import { OrderItemModel } from './order-item.model';
import { MoneyTool } from './money-tool.model';
import { StoreModel } from './store.model';
import { MemberType } from './member.enum';
import { OrderItemType } from './mw.enum';
import { IPay } from './pay.interface';

export class OrderModel extends BaseModel implements ISerializer {
    orderNo: string;
    originalMoney:number;
    receivableMoney:number;
    realReceivableMoney:number;
    repair:boolean;
    remark:string;
    orderDate:string;
    payDate: string;
    source:OrderSource;
    status:OrderStatus;
    orderType:OrderType;
    member: MemberModel;
    itemList:OrderItemModel[];
    store:StoreModel;
    // constructor(id: number, order_no: string, pay_date: string) {
    //     super(id);
    //     this.order_no = order_no;
    //     this.pay_date = pay_date;
    // }

    // constructor(id: number, order_no: string, pay_date: string,member_id:number,member_no:string,member_name:string,member_mobile:string) {
    //     this(id,order_no,pay_date);
    //     this.member = new MemberModel(member_id,member_no,member_name,member_mobile);
    // }
    //constructor(id: number, order_no: string, pay_date: string);
    // constructor(id: number, order_no: string, pay_date: string, member_id?: number, member_no?: string, member_name?: string, member_mobile?: string) {
    //     super(id);
    //     this.order_no = order_no;
    //     this.pay_date = pay_date;
    //     if (member_id) {
    //         this.member = new MemberModel(member_id, member_no, member_name, member_mobile);
    //     }else{
    //         this.member = new MemberModel(0);
    //     }
    // }
    constructor(id?: number){
        super(id);
        this.itemList = [];
        this.member = new MemberModel();
        this.store = new StoreModel();
    }

    removeItemById(id:number){
        let index:number;
        this.itemList.forEach((item:OrderItemModel,idx:number)=>{
            if(item.id == id){
                index = idx;
                return;
            }
        });
        this.itemList.splice(index,1);
    }

    addPayItem(payItem:IPay){
        if(this.itemList){
            this.itemList.forEach((item:OrderItemModel,index:number)=>{
                item.addPayItem(payItem);
            })
        }
    }

    get originMoney(){
        let totalMoney = 0;
        if(this.itemList){
            this.itemList.forEach((item:OrderItemModel,index:number)=>{
                totalMoney += item.totalMoney;
            })
        }
        return totalMoney;
    }
    get discountMoney(){
        let discount = 0;
        if(this.itemList){
            this.itemList.forEach((item:OrderItemModel,index:number)=>{
                discount += item.totalMoney;
            })
        }
        return discount;
    }
    get unPayMoney(){
        let unpay = 0;
        if(this.itemList){
            this.itemList.forEach((item:OrderItemModel,index:number)=>{
                unpay += item.unPayMoney;
            })
        }
        return unpay;
    }

    get serviceItemCount(){
        let count = 0;
        if(this.itemList){
            this.itemList.forEach((item:OrderItemModel,index:number)=>{
                if(item.itemType == OrderItemType.SERVICE_ITEM){
                    count++;
                }
            })
        }
        return count;
    }
    get productCount(){
        let count = 0;
        if(this.itemList){
            this.itemList.forEach((item:OrderItemModel,index:number)=>{
                if(item.itemType == OrderItemType.PRODUCT){
                    count++;
                }
            })
        }
        return count;
    }
    get servicePackageCount(){
        let count = 0;
        if(this.itemList){
            this.itemList.forEach((item:OrderItemModel,index:number)=>{
                if(item.itemType == OrderItemType.SERVICE_PACKAGE){
                    count++;
                }
            })
        }
        return count;
    }

    //获取一个支付方式已经支付的金额或次数
    getPayById(payId:number):number{
        //支付的金额或次数
        let payAmount:number = 0;
        if(!payId || payId == 0){
            return payAmount;
        }
        if(this.itemList){
            this.itemList.forEach((item:OrderItemModel)=>{
                if(item.payList){
                    item.payList.forEach((payItem:IPay)=>{
                        if(payItem.getPayModelId() > 0 && payItem.getPayModelId() == payId){
                            payAmount += payItem.payAmount;
                        }
                    });
                }
            });
        }
        return payAmount;
    }

    serializer(model:any){
        super.serializer(model.id);
        this.originalMoney = MoneyTool.point2yuan(model.originalMoney);
        this.receivableMoney = MoneyTool.point2yuan(model.receivableMoney);
        this.realReceivableMoney = MoneyTool.point2yuan(model.realReceivableMoney);
        this.orderNo = model.orderNo;
        this.payDate = model.payDate;
        this.orderDate = model.orderDate;
        this.source = +model.source;
        this.status = +model.status;
        this.orderType = +model.orderKind;

        if(model.simpleMemberVo){
            model.simpleMemberVo.id = model.memberId;//???
            model.simpleMemberVo.name = model.memberName;
            model.simpleMemberVo.mobile = model.memberMobile;
            model.simpleMemberVo.memberNo = model.memberNo;
        }
        
        this.member = new MemberModel().serializer(model.simpleMemberVo || model.member);
        if(model.orderItems && model.orderItems.length > 0){
            this.itemList = [];
            for(let i in model.orderItems){
                //this.itemList.push(ItemFactory.serializerItem(model.orderItems[i]));
                this.itemList.push(new OrderItemModel().serializer(model.orderItems[i]));
            }
        }
        return this;
    } 

    unserializer(){
        let model = super.unserializer();
        model.source = this.source || "14";
        if(this.store){
            model.storeId = this.store.id;
        }
        if(this.member){
            model.member = this.member.unserializer();
        }else{
            model.member = {
                memberId:-1,
                memberName:'散客',
                memberType:MemberType.IDLE_MEMBER
            };
        }
        
        model.originalMoney = MoneyTool.yuan2point(this.originMoney);
        model.realReceivableMoney = model.originalMoney;
        model.receivableMoney = 0;

        if(this.itemList && this.itemList.length > 0){
            model.orderItems = [];
            this.itemList.forEach((item:any,index:number)=>{
                if(item){
                    model.receivableMoney += MoneyTool.yuan2point(item.discountMoney);
                    model.orderItems.push(item.unserializer());
                }
            });
        }
        return model;
    }

}
