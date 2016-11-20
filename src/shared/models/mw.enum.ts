export enum GenderType{
    MALE = 1,//男
    FEMALE = 2//女
}

export enum MerchantType{
	PROFESSIONAL = 1,//专业版
	LITE = 2 //简化版
}

export enum MwStatus{
	AVAILABLE = 1,//可用
	UNAVAILABLE = 2 //不可用
}

export enum PayType{
	CASH = 10,//现金
	POS = 20,//POS
	CARD = 30,//卡
	WALLET = 31,//钱包
	WECHAT = 40,//微信
	GROUP = 41,//团购
	ALIPAY = 42,//支付宝
	ACTIVITY = 50,//活动
	FREE = 60,//赠品
	DEBT = 71,//欠款
    QRCODE = 72,//扫码支付
	REDUCE = 70//减免
	//100 以上为自定义支付方式
}

export enum CardType{
	DISCOUNT = 1,//折扣卡
	CASH = 2,//储值卡
	TIME = 3,//时段卡
	TIMES_TOTAL = 4,//疗程总次卡
	TIMES = 5//疗程分次卡
}

export enum OrderType{
    ALL = 1,//综合消费
    CARD = 2,//购卡/开卡
    RECHARGE = 3 //卡充值/钱包充值
}

// export enum ItemType{
//     PRODUCT = 1,//产品
//     SERVICE_ITEM = 2,//项目
//     SERVICE_PACKAGE = 3,//套餐
//     //CARD = 4,//卡
//     CARD_DISCOUNT = 41,//折扣卡
//     CARD_CASH = 42,//储值卡
//     CARD_TIME = 43,//时段卡
//     CARD_TIMES_TOTAL = 44,//疗程总次卡
//     CARD_TIMES = 45,//疗程分次卡
//     TICKET = 5,//券
//     ACTIVITY = 6//活动
// }

export enum OrderItemType{
    PRODUCT = 1,//产品
    SERVICE_ITEM = 2,//项目
    SERVICE_PACKAGE = 3,//套餐
    CARD = 4,//卡
    TICKET = 5,//券
    ACTIVITY = 6,//活动
    CARD_RECHARGE = 7,//卡充值
    WALLET_RECHARGE = 8//钱包充值
}

export enum PayRuleType{
    ALL = 0,//全店通用
    STORE = 1,//门店
    PRODUCT = 2,//产品
    SERVICE_ITEM = 3,//项目
    SERVICE_PACKAGE = 4,//套餐
    CARD = 5,//卡
    SERVICE_ITEM_CATEGORY = 6,//项目分类
    SERVICE_PACKAGE_CATEGORY = 7,//组合分类
    PRODUCT_CATEGORY = 8,//产品分类
    ALL_CATEGORY = 9//所有分类
}

export enum PresentType{
    ORIGINAL_CONSUME = 1,//原价消费
    CARD = 2,//卡
    TICKET = 3,//券
    PRODUCT = 4,//产品
    SERVICE_ITEM = 5,//项目
    SERVICE_PACKAGE = 6,//套餐
    CARD_MONEY = 7//卡内金额
}

export enum OrderSource{
    MEIWEN = 14//美问
}

export enum OrderStatus{
    UNPAID = 11,//待支付
    PAID = 20,//已支付
 	PAID_LEFT = 40,//尾款
 	HISTORY = 41//历史订单
}

export enum DiscountType{
    NONE = 0,//没有优惠
    DISCOUNT = 1,//折扣
    REDUCE = 2,//减免
    NEW_PRICE = 3//活动价或会员价
}