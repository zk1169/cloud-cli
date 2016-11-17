import { ItemBaseModel } from './item-base.model';

export class CouponBaseModel extends ItemBaseModel{

}

//现金券
export class CouponCashModel extends CouponBaseModel{

}

//总次券
export class CouponTimesTotalModel extends CouponBaseModel{

}

//分次券
export class CouponTimesModel extends CouponBaseModel{

}

//原价消费
export class OriginalConsumeModel extends ItemBaseModel{

}

//卡内金额
export class CardMoneyModel extends ItemBaseModel{

}
