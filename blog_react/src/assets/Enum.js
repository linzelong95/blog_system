import { generateUrls } from '@/utils/utils';

const CommonEnum = {
  // 性别
  Sex: {
    NULL: { code: 0, desc: '未设定' },
    MALE: { code: 1, desc: '男' },
    FEMALE: { code: 2, desc: '女' },
  },
  ActionStatus_POS: {
    PLATFORM_DELETE: { zh_CN: "平台已删", en_US: "has deleted by platform" },
    PLATFORM_LOCK: { zh_CN: "平台已锁", en_US: "has locked by platform" },
    MERCHANT_DELETE: { zh_CN: "商家已删", en_US: "has deleted by merchant" },
    MERCHANT_LOCK: { zh_CN: "商家已锁", en_US: "has locked by merchant" },
    CHECK_WAIT: { zh_CN: "待审核", en_US: "CHECK_WAIT" },
    CHECK_PASS: { zh_CN: "审核通过", en_US: "CHECK_PASS" },
    CHECK_FAIL: { zh_CN: "审核失败", en_US: "CHECK_FAIL" },
    RECORD_WAIT: { zh_CN: "待备案", en_US: "RECORD_WAIT" },
    RECORD_PASS: { zh_CN: "备案通过", en_US: "RECORD_PASS" },
    RECORD_FAIL: { zh_CN: "备案失败", en_US: "RECORD_FAIL" },
    PUT_WAIT: { zh_CN: "待上架", en_US: "PUT_WAIT" },
    PUT_ON: { zh_CN: "已上架", en_US: "PUT_ON" },
    PUT_DOWN: { zh_CN: "已下架", en_US: "PUT_DOWN" },
    DRAFT: { zh_CN: "草稿", en_US: "draft" },
    ENABLE: { zh_CN: "可用", en_US: "enable" },
    READ: { zh_CN: "已读", en_US: "has read" },
    UNREAD: { zh_CN: "未读", en_US: "unread" },
    ACT: { zh_CN: "已启用", en_US: "act" },
    UNACT: { zh_CN: "待启用", en_US: "unact" },
  },
  // 审核
  CheckStatus: {
    0: { zh_CN: "待审核", en_US: "WAIT_CHECK" },
    1: { zh_CN: "审核通过", en_US: "PASS" },
    2: { zh_CN: "审核失败", en_US: "NOPASS" },
    undefined: { zh_CN: "", en_US: "" },
  },
  CheckStatus_POS: {
    WAIT: { code: 0, zh_CN: "待审核", en_US: "WAIT_CHECK" },
    PASS: { code: 1, zh_CN: "审核通过", en_US: "PASS" },
    NOPASS: { code: 2, zh_CN: "审核失败", en_US: "NOPASS" },
  },
  // 布尔值
  Bool: {
    0: { zh_CN: "否", en_US: "FALSE", flag: false },
    1: { zh_CN: "是", en_US: "TRUE", flag: true },
    undefined: { zh_CN: "", en_US: "", flag: false },
  },
  Bool_POS: {
    FALSE: { code: 0, zh_CN: "否", en_US: "FALSE", flag: false },
    TRUE: { code: 1, zh_CN: "是", en_US: "TRUE", flag: true },
  },
  Show: {
    0: { zh_CN: "已隐藏", en_US: "hide", flag: false },
    1: { zh_CN: "已显示", en_US: "show", flag: true },
    undefined: { zh_CN: "", en_US: "", flag: false },
  },
  Show_POS: {
    UNSHOW: { code: 0, zh_CN: "已隐藏", en_US: "hide", flag: false },
    SHOW: { code: 1, zh_CN: "已显示", en_US: "show", flag: true },
  },
  Read: {
    0: { zh_CN: "未读", en_US: "unread", flag: false },
    1: { zh_CN: "已读", en_US: "read", flag: true },
    undefined: { zh_CN: "", en_US: "", flag: false },
  },
  Top: {
    0: { zh_CN: "已取置", en_US: "unstuck", flag: false },
    1: { zh_CN: "已置顶", en_US: "stick", flag: true },
    undefined: { zh_CN: "", en_US: "", flag: false },
  },
  Top_POS: {
    UNTOP: { code: 0, zh_CN: "已取置", en_US: "unstuck", flag: false },
    TOP: { code: 1, zh_CN: "已置顶", en_US: "stick", flag: true },
  },
  Act: {
    0: { zh_CN: "已启用", en_US: "acting", flag: false },
    1: { zh_CN: "已停用", en_US: "stop", flag: true },
    undefined: { zh_CN: "", en_US: "", flag: false },
  },
  Act_POS: {
    ACT: { code: 0, zh_CN: "已启用", en_US: "acting", flag: false },
    UNACT: { code: 1, zh_CN: "待启用", en_US: "stop", flag: true },
  },
  PlatForm_Lock: {
    0: { zh_CN: "未锁", en_US: "unlock", flag: false },
    1: { zh_CN: "平台已锁", en_US: "locking", flag: true },
    undefined: { zh_CN: "", en_US: "", flag: false },
  },
  Merchant_Lock: {
    0: { zh_CN: "未锁", en_US: "unlock", flag: false },
    1: { zh_CN: "商家已锁", en_US: "locking", flag: true },
    undefined: { zh_CN: "", en_US: "", flag: false },
  },
  // 最高权限
  Root: {
    1: { zh_CN: "最高权", en_US: "root" },
    0: { zh_CN: "无权限", en_US: "user" },
    undefined: { zh_CN: "", en_US: "" },
  },
  Root_POS: {
    OWN_RIGHT: { code: 1, zh_CN: "最高权", en_US: "root" },
    NO_RIGHT: { code: 0, zh_CN: "无权限", en_US: "user" },
  },
  // 是否可见
  Visible: {
    NO: { code: 0, desc: '不可见' },
    YES: { code: 1, desc: '可见' },
  },
  // 是否锁定
  IsLock: {
    NO: { code: 0, desc: '解锁' },
    YES: { code: 1, desc: '锁定' },
  },
  // 是否删除
  IsDelete: {
    NO: { code: 0, desc: '可用' },
    YES: { code: 1, desc: '已删除' },
    DELETE: { code: 2, desc: '永久删除' },
  },
  // 排序反向
  Direction: {
    ASC: { code: 0, desc: '升序' },
    DESC: { code: 1, desc: '降序' },
  },
  // 上传类型
  UploadType: {
    FILE: { code: 1, desc: '文件' },
    IMAGE: { code: 10, desc: '图片' },
    ATTACHMENT: { code: 20, desc: '附件' },
    RICHTEXT: { code: 30, desc: '富文本' },
    CACHE: { code: 50, desc: '缓存' },
  },
  // 上传文件夹
  UploadFolder: {
    PRODUCT_IMAGE: { code: 10, desc: '商品图片' },
    PRODUCT_DETAIL: { code: 11, desc: '商品详细' },
    BRAND_IMAGE: { code: 20, desc: '品牌图片' },
    BRAND_VOUCHER: { code: 21, desc: '品牌授权' },
  },
  // 排序
  SortField: {
    name: { code: 1, zh_CN: "名称", en_US: "name" },
    sale_price: { code: 10, zh_CN: "销售价", en_US: "sale_price" },
    visti_counts: { code: 11, zh_CN: "浏览数", en_US: "visti_counts" },
    sale_counts: { code: 12, zh_CN: "销售量", en_US: "sale_counts" },
    add_date: { code: 2, zh_CN: "添加日期", en_US: "add_date" },
    ins_date: { code: 2, zh_CN: "添加日期", en_US: "ins_date" },// 营销管理/消息管理的添加日期字段与其他的不一样
    sequence: { code: 3, zh_CN: "排序", en_US: "sequence" },
    level: { code: 4, zh_CN: "等级", en_US: "level" },
    title: { code: 1, zh_CN: "新标题", en_US: "title" },
    send_date: { code: 2, zh_CN: "发信日期", en_US: "send_date" },
    undefined: { code: 0, zh_CN: "默认", en_US: "default" },

    DEFAULT: { code: 0, desc: '默认' },
    NAME: { code: 1, desc: '名称' },
    INSDATE: { code: 2, desc: '添加日期' },
    SEQUENCE: { code: 3, desc: '排序' },
    LEVEL: { code: 4, desc: '等级' },
    SALE_PRICE: { code: 10, desc: '销售价' },
    VISTI_COUNTS: { code: 11, desc: '浏览数' },
    SALE_COUNTS: { code: 12, desc: '销量' },
  },
}


const MarketEnum = {
  // 是否启用
  IsAct: {
    NO: { code: 0, desc: '停用' },
    YES: { code: 1, desc: '启用' },
  },
  // 优惠券类型
  CouponType: {
    0: { zh_CN: "全场通用", en_US: "ALL" },
    1: { zh_CN: "限定商品", en_US: "PRODUCT" },
    2: { zh_CN: "限定品牌", en_US: "BRAND" },
    3: { zh_CN: "限定品类", en_US: "CATEGORY" },
    4: { zh_CN: "限定仓库", en_US: "WAREHOUSE" },
    undefined: { zh_CN: "", en_US: "" },
  },
  CouponType_POS: {
    ALL: { code: 0, zh_CN: "全场通用", en_US: "ALL" },
    PRODUCT: { code: 1, zh_CN: "限定商品", en_US: "PRODUCT" },
    BRAND: { code: 2, zh_CN: "限定品牌", en_US: "BRAND" },
    CATEGORY: { code: 3, zh_CN: "限定品类", en_US: "CATEGORY" },
    WAREHOUSE: { code: 4, zh_CN: "限定仓库", en_US: "WAREHOUSE" },
  },
  // 领取状态
  GetStatus: {
    NOGET: { code: 0, desc: '未领取' },
    GET: { code: 1, desc: '已领取' },
  },
  // 使用状态
  UsedStatus: {
    NOUSE: { code: 0, desc: '未使用' },
    USE: { code: 1, desc: '已使用' },
    EXPIRED: { code: 2, desc: '已过期' },
  },
  // 促销类型
  PromotionType: {
    1: { zh_CN: "加价购", en_US: "ADD" },
    2: { zh_CN: "满额减", en_US: "FULLAMT" },
    3: { zh_CN: "满件减", en_US: "FULLCNT" },
    4: { zh_CN: "N元选", en_US: "N yuan choose" },
    undefined: { zh_CN: "", en_US: "" },
  },
  PromotionType_POS: {
    ADD: { code: 1, zh_CN: "加价购", en_US: "ADD" },
    FULLAMT: { code: 2, zh_CN: "满额减", en_US: "FULLAMT" },
    FULLCNT: { code: 3, zh_CN: "满件减", en_US: "FULLCNT" },
    CHOICE: { code: 4, zh_CN: "N元选", en_US: "N yuan choose" },
  },
  // 优惠类型
  DiscountType_POS: {
    REDUCE: { code: 0, zh_CN: '满减', en_US: "OFF" },
    DISCOUNT: { code: 1, zh_CN: '满折', en_US: "DISCOUNT" },
  },
};


const MemberEnum = {
  // 所属类型
  OwnerType: {
    ALL: { code: 0, desc: '全部' },
    SHOP: { code: 1, desc: '商城' },
    STORE: { code: 2, desc: '商家' },
  },
  // 订单状态
  OrderType: {
    ALL: { code: 0, desc: '全部' },
    WAIT_PAY: { code: 1, desc: '待付款' },
    WAIT_SEND: { code: 2, desc: '待发货' },
    WAIT_RECEIVE: { code: 3, desc: '待收货' },
    WAIT_EVALUATE: { code: 4, desc: '待评价' },
    RECYCLE: { code: 5, desc: '回收站' },

    COMPLETE: { code: 6, desc: '订单完成' },
    CLOSE: { code: 7, desc: '订单关闭' },
    ERROR: { code: 8, desc: '订单失败' },
  },
  // 用户关闭原因
  CloseReasonType: {
    WANT_NOT: { code: 100, desc: '我不想买了' },
    BUY_AGAIN: { code: 101, desc: '信息填写错误' },
    OUT_STOCK: { code: 102, desc: '卖家缺货' },
    MEET_BUY: { code: 103, desc: '同城见面交易' },
    PAY_QUESION: { code: 104, desc: '付款遇到问题' },
    BUY_WRONG: { code: 105, desc: '拍错了' },
    OTHER_REASON: { code: 150, desc: '其他原因' },
  },
  // 用户售后原因
  ServiceReasonType: {
    WANT_NOT: { code: 100, desc: '我不想要了' },
    OTHER_REASON: { code: 150, desc: '其他原因' },
  },
  // 评价状态
  EvaluateType: {
    WAIT: { code: 0, desc: '待评价' },
    EVA: { code: 1, desc: '已评价' },
    REEVA: { code: 2, desc: '已追评' },
  },
  // 优惠券类型
  CouponType: {
    ENABLE: { code: 0, desc: '可使用' },
    USED: { code: 1, desc: '已使用' },
    EXPIRED: { code: 2, desc: '已过期' },
  },
  // 收藏类型
  CollectionType: {
    ALL: { code: 0, desc: '全部收藏' },
    PROMOTION: { code: 1, desc: '正在促销' },
    DISCOUNT: { code: 2, desc: '降价商品' },
    SALEOFF: { code: 3, desc: '下架商品' },
  },
};


const MessageEnum = {
  // 站内信类型
  LetterType: {
    1: { zh_CN: "平台信息", en_US: "PLATFORM_LETTER" },
    10: { zh_CN: "用户注册", en_US: "MEMBER_REGISTER" },
    11: { zh_CN: "用户修改密码", en_US: "PMEMBER_CHANGEPWD" },
    12: { zh_CN: "用户找回密码", en_US: "MEMBER_RETURNPWD" },
    20: { zh_CN: "成为会员", en_US: "ADMIN_REGISTER" },
    50: { zh_CN: "订单下单", en_US: "ORDER_ADD" },
    51: { zh_CN: "订单支付", en_US: "ORDER_PAY" },
    52: { zh_CN: "订单发货", en_US: "ORDER_SHIP" },
    53: { zh_CN: "订单收货", en_US: "ORDER_RECEIVE" },
    54: { zh_CN: "订单售后", en_US: "ORDER_AFTERSALE" },
    55: { zh_CN: "订单退货", en_US: "ORDER_RETURN" },
    56: { zh_CN: "订单退款", en_US: "ORDER_REFUND" },
    57: { zh_CN: "订单关闭", en_US: "ORDER_CLOSE" },
    undefined: { zh_CN: "", en_US: "" },
    PLATFORM_LETTER: { code: 1, desc: '平台信息' },
    MEMBER_REGISTER: { code: 10, desc: '用户注册' },
    MEMBER_CHANGEPWD: { code: 11, desc: '用户修改密码' },
    MEMBER_RETURNPWD: { code: 12, desc: '用户找回密码' },
    ADMIN_REGISTER: { code: 20, desc: '成为会员' },
    ORDER_ADD: { code: 50, desc: '订单下单' },
    ORDER_PAY: { code: 51, desc: '订单支付' },
    ORDER_SHIP: { code: 52, desc: '订单发货' },
    ORDER_RECEIVE: { code: 53, desc: '订单收货' },
    ORDER_AFTERSALE: { code: 54, desc: '订单售后' },
    ORDER_RETURN: { code: 55, desc: '订单退货' },
    ORDER_REFUND: { code: 56, desc: '订单退款' },
    ORDER_CLOSE: { code: 57, desc: '订单关闭' },
  },
}


const OrderEnum = {
  // 总订单状态
  GorderStatus: {
    WAIT_PAY: { code: 0, desc: '待付款' },
    PAY: { code: 0, desc: '已付款' },
    CLOSE: { code: 0, desc: '已关闭' },
  },
  // 订单状态
  OrderStatus: {
    0: { zh_CN: "待付款", en_US: "WAIT_PAY" },
    1: { zh_CN: "待报关", en_US: "WAIT_RECORD" },
    2: { zh_CN: "待发货", en_US: "WAIT_SEND" },
    3: { zh_CN: "待收货", en_US: "WAIT_RECEIVE" },
    4: { zh_CN: "交易成功", en_US: "SUCCESS" },
    5: { zh_CN: "交易关闭", en_US: "CLOSE" },
    6: { zh_CN: "交易失败", en_US: "ERROR" },
    undefined: { zh_CN: "", en_US: "" },
  },
  OrderStatus_POS: {
    WAIT_PAY: { code: 0, zh_CN: "待付款", en_US: "WAIT_PAY" },
    WAIT_RECORD: { code: 1, zh_CN: "待报关", en_US: "WAIT_RECORD" },
    WAIT_SEND: { code: 2, zh_CN: "待发货", en_US: "WAIT_SEND" },
    WAIT_RECEIVE: { code: 3, zh_CN: "待收货", en_US: "WAIT_RECEIVE" },
    SUCCESS: { code: 4, zh_CN: "交易成功", en_US: "SUCCESS" },
    CLOSE: { code: 5, zh_CN: "交易关闭", en_US: "CLOSE" },
    ERROR: { code: 6, zh_CN: "交易失败", en_US: "ERROR" },
  },
  // 订单关闭原因
  CloseReason: {
    SYSTEM: { code: 0, desc: '系统关闭' },
    TIME_OUT: { code: 1, desc: '超时关闭' },
    BAD_BRUSH: { code: 2, desc: '恶意刷单' },
    OTHER_REASON: { code: 49, desc: '其他原因' },
  },
  // 商家关闭原因 （用户关闭原因 见 MemberEnum.CloseReasonType）
  CloseReasonType: {
    OVERTIME: { code: 0, zh_CN: '超时', en_US: "overtime" },
    STOCK_OUT: { code: 1, zh_CN: '售罄', en_US: "stock out" },
    OTHER_REASON: { code: 100, zh_CN: '其他', en_US: "other" },
    // TIME_CLOSE: { code: 0, desc: '系统超时关闭' },
    // STOCK_OUT: { code: 1, desc: '商品已售罄' },
    // OTHER_REASON: { code: 100, desc: '其他原因' },
  },
  // 支付类型
  PayWay: {
    ALIPAY: { code: 1, desc: '支付宝' },
    WXPAY: { code: 2, desc: '微信' },
    OPENEPAY: { code: 3, desc: '开联通' },
  },
  // 支付方式
  PayMode: {
    JUMP: { code: 1, desc: '跳转' },
    PREPOSE: { code: 2, desc: '前置' },
  },
  // 售后状态
  ServiceStatus_POS: {
    APPLY: { code: 0, zh_CN: "待确认", en_US: "applying for after_sales service" },
    CONFIRM: { code: 1, zh_CN: "待寄商品", en_US: "accepted the request(waiting for the goods to be sent back)" },
    SOLVE: { code: 2, zh_CN: "待退款", en_US: "solve the after_sales service(waiting for a refund)" },
    COMPLETE: { code: 3, zh_CN: "已完成", en_US: "complete after_sales service" },
    CLOSE: { code: 4, zh_CN: "已关闭", en_US: "close after_sales service" },
    CANCEL: { code: 5, zh_CN: "已取消", en_US: "cancel after_sales service" },
    ERROR: { code: 6, zh_CN: "售后失败", en_US: "after_sales service failed" },
  },
  // ServiceStatus_POS: {
  //   APPLY: { code: 0, zh_CN: "申请售后", en_US: "applying for after_sales service" },
  //   CONFIRM: { code: 1, zh_CN: "确认售后(等待商品寄回)", en_US: "accepted the request(waiting for the goods to be sent back)" },
  //   SOLVE: { code: 2, zh_CN: "解决售后(等待退款)", en_US: "solve the after_sales service(waiting for a refund)" },
  //   COMPLETE: { code: 3, zh_CN: "完成售后", en_US: "complete after_sales service" },
  //   CLOSE: { code: 4, zh_CN: "关闭售后", en_US: "close after_sales service" },
  //   CANCEL: { code: 5, zh_CN: "取消售后", en_US: "cancel after_sales service" },
  //   ERROR: { code: 6, zh_CN: "售后失败", en_US: "after_sales service failed" },
  // },
  // 售后类型
  ServiceType: {
    0: { zh_CN: "仅退款", en_US: "REFUND" },
    1: { zh_CN: "退款退货", en_US: "PRODUCT_REFUND" },
    undefined: { zh_CN: "", en_US: "" },
  },
  ServiceType_POS: {
    REFUND: { code: 0, zh_CN: "仅退款", en_US: "for refund" },
    PRODUCT_REFUND: { code: 1, zh_CN: "退款退货", en_US: "return of goods and refund" },
  },
  // 退款类型
  RefundType_POS: {
    PLAT_WAY: { code: 0, zh_CN: "平台方式", en_US: "PLAT_WAY" },
    PAY_WAY: { code: 1, zh_CN: "支付方式", en_US: "PAY_WAY" },
  },
  // 售价类型
  PriceType: {
    1: { zh_CN: "普通价", en_US: "COMMON_PRICE" },
    2: { zh_CN: "会员价", en_US: "VIP_PRICE" },
    3: { zh_CN: "特价", en_US: "SPECIAL_PRICE" },
    4: { zh_CN: "特卖", en_US: "SPSELL" },
    5: { zh_CN: "预售", en_US: "PRESELL" },
    6: { zh_CN: "限时购", en_US: "COUNTDOWN" },
    7: { zh_CN: "团购", en_US: "GROUPBUY" },
    8: { zh_CN: "促销购", en_US: "PROMOTION" },
    undefined: { zh_CN: "", en_US: "" },
    COMMON: { code: 1, desc: '普通价' },
    MEMBER: { code: 2, desc: '会员价' },
    SPECIAL: { code: 3, desc: '特价' },
    SPSELL: { code: 4, desc: '特卖' },
    PRESELL: { code: 5, desc: '预售' },
    COUNTDOWN: { code: 6, desc: '限时购' },
    GROUPBUY: { code: 7, desc: '团购' },
    PROMOTION: { code: 8, desc: '促销购' },
  },
};


const ProductEnum = {
  // 仓库类型
  WareType: {
    1: { zh_CN: "国内仓", en_US: "CHINA_WAREHOUSE" },
    2: { zh_CN: "直邮仓", en_US: "DIRECT_MAIL_WAREHOUSE" },
    3: { zh_CN: "保税仓", en_US: "BONDED_WAREHOUSE" },
    undefined: { zh_CN: "", en_US: "" }
  },
  WareType_POS: {
    CHINA_WAREHOUSE: { code: 1, zh_CN: "国内仓", en_US: "CHINA_WAREHOUSE" },
    DIRECT_MAIL_WAREHOUSE: { code: 2, zh_CN: "直邮仓", en_US: "DIRECT_MAIL_WAREHOUSE" },
    BONDED_WAREHOUSE: { code: 3, zh_CN: "保税仓", en_US: "BONDED_WAREHOUSE" },
  },
  //  (属性)编辑模式
  EditMode: {
    1: { zh_CN: "单选", en_US: "SINGLE" },
    2: { zh_CN: "多选", en_US: "MULTIPLE" },
    3: { zh_CN: "输入", en_US: "INPUT" },
    undefined: { zh_CN: "", en_US: "" }
  },
  EditMode_POS: {
    SINGLE: { code: 1, zh_CN: "单选", en_US: "SINGLE" },
    MULTIPLE: { code: 2, zh_CN: "多选", en_US: "MULTIPLE" },
    INPUT: { code: 3, zh_CN: "输入", en_US: "INPUT" },
  },

  // 属性类型
  AttributeType: {
    1: { zh_CN: "基础属性", en_US: "BASE" },
    2: { zh_CN: "系列属性", en_US: "SERIES" },
    3: { zh_CN: "导购属性", en_US: "GUIDE" },
    undefined: { zh_CN: "", en_US: "" }
  },
  AttributeType_POS: {
    BASE: { code: 1, zh_CN: "基础属性", en_US: "BASE" },
    SERIES: { code: 2, zh_CN: "系列属性", en_US: "SERIES" },
    GUIDE: { code: 3, zh_CN: "导购属性", en_US: "GUIDE" },
  },
  // 备案状态
  RegStatus: {
    WAIT: { code: 0, desc: '未备案' },
    REGING: { code: 1, desc: '备案中' },
    COMPLETE: { code: 2, desc: '已备案' },
    FAILY: { code: 3, desc: '已退回' },
    CANCEL: { code: 4, desc: '已取消' },
  },
  // 销售状态
  SaleStatus: {
    0: { zh_CN: "回收站", en_US: "RECYCLE" },
    1: { zh_CN: "待提交", en_US: "WAIT_SUBMIT" },
    2: { zh_CN: "待审核", en_US: "WAIT_CHECK" },
    3: { zh_CN: "审核失败", en_US: "CHECK_NOPASS" },
    4: { zh_CN: "待备案", en_US: "WAIT_RECORD" },
    5: { zh_CN: "备案失败", en_US: "RECORD_NOPASS" },
    6: { zh_CN: "待上架", en_US: "WAIT_SALEON" },
    7: { zh_CN: "已上架", en_US: "SALEON" },
    8: { zh_CN: "已锁定", en_US: "LOCK" },
    undefined: { zh_CN: "", en_US: "" },
  },
  SaleStatus_POS: {
    RECYCLE: { code: 0, zh_CN: "回收站", en_US: "RECYCLE" },
    WAIT_SUBMIT: { code: 1, zh_CN: "待提交", en_US: "WAIT_SUBMIT" },
    WAIT_CHECK: { code: 2, zh_CN: "待审核", en_US: "WAIT_CHECK" },
    CHECK_NOPASS: { code: 3, zh_CN: "审核失败", en_US: "CHECK_NOPASS" },
    WAIT_RECORD: { code: 4, zh_CN: "待备案", en_US: "WAIT_RECOR" },
    RECORD_NOPASS: { code: 5, zh_CN: "备案失败", en_US: "RECORD_NOPASS" },
    WAIT_SALEON: { code: 6, zh_CN: "待上架", en_US: "WAIT_SALEON" },
    SALEON: { code: 7, zh_CN: "已上架", en_US: "SALEON" },
    LOCK: { code: 8, zh_CN: "已锁定", en_US: "LOCK" },
  },
  // 价格类型
  PriceType: {
    COMMON: { code: 1, desc: '普通价' },
    MEMBER: { code: 2, desc: '会员价' },
    SPECIAL: { code: 3, desc: '特价' },
    SPSELL: { code: 4, desc: '特卖' },
    PRESELL: { code: 5, desc: '预售' },
  },
};


const SystemEnum = {
  // 所属类型
  OwnerType: {
    0: { zh_CN: "平台", en_US: "PLATFORM" },
    1: { zh_CN: "商家", en_US: "MERCHANT" },
    undefined: { zh_CN: "", en_US: "" },
  },
  // ManageType_POS: {
  //   PLATFORM: { code: 1, zh_CN: "平台", en_US: "PLATFORM" },
  //   MERCHANT: { code: 2, zh_CN: "商家", en_US: "MERCHANT" },
  // },
  // 平台类型
  PlatType: {
    1: { zh_CN: "平台", en_US: "PLATFORM" },
    2: { zh_CN: "供应商", en_US: "SUPPLIER" },
    3: { zh_CN: "销售商", en_US: "SELLER" },
    100: { zh_CN: "用户", en_US: "MEMBER" },
    undefined: { zh_CN: "", en_US: "" },
  },
  PlatType_POS: {
    PLATFORM: { code: 1, zh_CN: "平台", en_US: "PLATFORM" },
    SUPPLIER: { code: 2, zh_CN: "供应商", en_US: "SUPPLIER" },
    SELLER: { code: 3, zh_CN: "销售商", en_US: "SELLER" },
    MEMBER: { code: 100, zh_CN: "用户", en_US: "MEMBER" },
  },
  // 终端类型
  Terminal: {
    PC: { code: 1, desc: '电脑' },
    CELL: { code: 2, desc: '手机端' },
    MACHINE: { code: 3, desc: '购物宝' },
  },
  // Session Key
  SessionKeys: {
    ADMIN_INFO: { code: 1, desc: '管理员对象' },
    USER_INFO: { code: 15, desc: '用户对象' },
    USER_LOGIN_SUM: { code: 16, desc: '登录次数' },
  },
  // Redis Key
  RedisKeys: {
    // [网页]验证码
    CODE_HTML: { code: 0, desc: 'EC6:CODE:HTML:{0}' },
    // [手机/邮箱]验证码
    CODE_REMOTE: { code: 1, desc: 'EC6:CODE:REMOTE:{0}' },
    // [加密]RSA私钥
    CODE_PRIKEY: { code: 2, desc: 'EC6:CODE:PRIKEY:{0}' },
    // [限流]限制
    THR_LIMIT: { code: 3, desc: 'EC6:Throttle:LIMIT:{0}' },
    // [限流]禁止
    THR_FORBID: { code: 4, desc: 'EC6:Throttle:FORBID:{0}' },

    // 黑名单
    // 禁止操作的IP
    BLACK_IP: { code: 5, desc: 'EC6:BLACK:IP' },
    // 禁止操作的账号
    BLACK_ACCOUNT: { code: 6, desc: 'EC6:BLACK:ACCOUNT' },
  },

  // 结果代码
  ExCode: {
    SUCCESS: { code: 0, desc: '成功' },
    ERROR: { code: 1, desc: '失败' },
    EXCEPTION: { code: 2, desc: '异常' },

    PLAT_NO_ACTION: { code: 10, desc: '当前平台不支持的操作' },

    USER_NO_LOGIN: { code: 20, desc: '用户未登录' },
    USER_ERROR_PASSWORD: { code: 21, desc: '密码错误' },
    USER_DIS_VISIBLE: { code: 22, desc: '用户不可用' },
    USER_IS_LOCK: { code: 23, desc: '用户已锁定' },
    USER_ERROR_SUM: { code: 24, desc: '登录失败次数过多' },

    ADMIN_NO_ACCOUNT: { code: 30, desc: '请使用管理员账号登录' },
    ADMIN_NO_LOGIN: { code: 31, desc: '管理员未登录' },
  },
  // 操作分类
  Assort: {
    0: { zh_CN: "未知", en_US: "UNDEFINED" },
    1: { zh_CN: "基础分类", en_US: "CATEGORY" },
    2: { zh_CN: "单位", en_US: "UNIT" },
    3: { zh_CN: "单位转换", en_US: "UNITCONVERT" },
    4: { zh_CN: "地区", en_US: "REGION" },
    5: { zh_CN: "快递", en_US: "EXPRESS" },
    10: { zh_CN: "商品", en_US: "PRODUCT" },
    11: { zh_CN: "品牌", en_US: "BRAND" },
    12: { zh_CN: "商家品牌", en_US: "BRANDSUPPLIER" },
    13: { zh_CN: "属性", en_US: "ATTRIBUTE" },
    14: { zh_CN: "属性值", en_US: "VALUE" },
    15: { zh_CN: "分类属性", en_US: "CATEGORYATTRIBUTE" },
    16: { zh_CN: "商品组合", en_US: "GROUP" },
    17: { zh_CN: "商品系列", en_US: "SERIES" },
    20: { zh_CN: "订单", en_US: "ORDER" },
    21: { zh_CN: "售后单", en_US: "BRAND" },
    30: { zh_CN: "仓库", en_US: "WAREHOUSE" },
    31: { zh_CN: "商家快递", en_US: "EXPRESSSUPPLIER" },
    32: { zh_CN: "物流模板", en_US: "SHIPTEMPLATE" },
    33: { zh_CN: "物流方式", en_US: "SHIPMODE" },
    40: { zh_CN: "优惠券", en_US: "COUPON" },
    41: { zh_CN: "限时购", en_US: "COUNTDOWN" },
    42: { zh_CN: "团购", en_US: "GROUPBUY" },
    43: { zh_CN: "促销购", en_US: "PROMOTION" },
    50: { zh_CN: "站内信", en_US: "LETTER" },
    51: { zh_CN: "商品评价", en_US: "REVIEW" },
    undefined: { zh_CN: "", en_US: "" },
  },
  Assort_POS: {
    CATEGORY: { code: 1, zh_CN: "基础分类", en_US: "CATEGORY" },
    UNIT: { code: 2, zh_CN: "单位", en_US: "UNIT" },
    UNITCONVERT: { code: 3, zh_CN: "单位转换", en_US: "UNITCONVERT" },
    REGION: { code: 4, zh_CN: "地区", en_US: "REGION" },
    EXPRESS: { code: 5, zh_CN: "快递", en_US: "EXPRESS" },
    PRODUCT: { code: 10, zh_CN: "商品", en_US: "PRODUCT" },
    BRAND: { code: 11, zh_CN: "品牌", en_US: "BRAND" },
    BRANDSUPPLIER: { code: 12, zh_CN: "商家品牌", en_US: "BRANDSUPPLIER" },
    ATTRIBUTE: { code: 13, zh_CN: "属性", en_US: "ATTRIBUTE" },
    VALUE: { code: 14, zh_CN: "属性值", en_US: "VALUE" },
    CATEGORYATTRIBUTE: { code: 15, zh_CN: "分类属性", en_US: "CATEGORYATTRIBUTE" },
    GROUP: { code: 16, zh_CN: "商品组合", en_US: "GROUP" },
    SERIES: { code: 17, zh_CN: "商品系列", en_US: "SERIES" },
    ORDER: { code: 20, zh_CN: "订单", en_US: "ORDER" },
    ORDERSERVICE: { code: 21, zh_CN: "售后单", en_US: "BRAND" },
    WAREHOUSE: { code: 30, zh_CN: "仓库", en_US: "WAREHOUSE" },
    EXPRESSSUPPLIER: { code: 31, zh_CN: "商家快递", en_US: "EXPRESSSUPPLIER" },
    SHIPTEMPLATE: { code: 32, zh_CN: "物流模板", en_US: "SHIPTEMPLATE" },
    SHIPMODE: { code: 33, zh_CN: "物流方式", en_US: "SHIPMODE" },
    COUPON: { code: 40, zh_CN: "优惠券", en_US: "COUPON" },
    COUNTDOWN: { code: 41, zh_CN: "限时购", en_US: "COUNTDOWN" },
    GROUPBUY: { code: 42, zh_CN: "团购", en_US: "GROUPBUY" },
    PROMOTION: { code: 43, zh_CN: "促销购", en_US: "PROMOTION" },
    LETTER: { code: 50, zh_CN: "站内信", en_US: "LETTER" },
    REVIEW: { code: 51, zh_CN: "商品评价", en_US: "REVIEW" },
  },

  // 操作类型
  Action: {
    1: { zh_CN: "操作", en_US: "ACTION" },
    2: { zh_CN: "获取列表", en_US: "LIST" },
    3: { zh_CN: "获取表单", en_US: "FORM" },
    4: { zh_CN: "添加", en_US: "INSERT" },
    5: { zh_CN: "编辑", en_US: "UPDATE" },
    6: { zh_CN: "删除", en_US: "DELETE" },
    7: { zh_CN: "还原", en_US: "REVERT" },
    8: { zh_CN: "永删", en_US: "REMOVE" },
    9: { zh_CN: "锁定", en_US: "LOCK" },
    10: { zh_CN: "解锁", en_US: "UNLOCK" },
    11: { zh_CN: "审核通过", en_US: "CHECKPASS" },
    12: { zh_CN: "审核不通过", en_US: "CHECKUNPASS" },
    13: { zh_CN: "备案通过", en_US: "RECORDPASS" },
    14: { zh_CN: "备案不通过", en_US: "RECORDUNPASS" },
    15: { zh_CN: "上架", en_US: "SALEON" },
    16: { zh_CN: "下架", en_US: "SALEOFF" },
    17: { zh_CN: "启用", en_US: "ACT" },
    18: { zh_CN: "停用", en_US: "UNACT" },
    19: { zh_CN: "发送", en_US: "SEND" },
    20: { zh_CN: "接收", en_US: "RECEIVE" },
    21: { zh_CN: "打开", en_US: "OPEN" },
    22: { zh_CN: "关闭", en_US: "CLOSE" },
    23: { zh_CN: "已读", en_US: "READ" },
    24: { zh_CN: "确认", en_US: "CONFIRM" },
    25: { zh_CN: "完成", en_US: "COMPLETE" },
    26: { zh_CN: "失败", en_US: "FAILURE" },
    27: { zh_CN: "取消", en_US: "CANCEL" },
    undefined: { zh_CN: "", en_US: "" },
  },
  Action_POS: {
    // UNDEFINED: { code: 1, desc: '操作' },

    LIST: { code: 2, zh_CN: "获取列表", en_US: "LIST" },
    FORM: { code: 3, zh_CN: "获取表单", en_US: "FORM" },
    INSERT: { code: 4, zh_CN: "添加", en_US: "INSERT" },
    UPDATE: { code: 5, zh_CN: "编辑", en_US: "UPDATE" },
    // 删除到回收站
    DELETE: { code: 6, zh_CN: "删除", en_US: "DELETE" },
    REVERT: { code: 7, zh_CN: "还原", en_US: "REVERT" },
    // 永久删除
    REMOVE: { code: 8, zh_CN: "永删", en_US: "REMOVE" },

    LOCK: { code: 9, zh_CN: "锁定", en_US: "LOCK" },
    UNLOCK: { code: 10, zh_CN: "解锁", en_US: "UNLOCK" },
    CHECKPASS: { code: 11, zh_CN: "审核通过", en_US: "CHECKPASS" },
    CHECKUNPASS: { code: 12, zh_CN: "审核不通过", en_US: "CHECKUNPASS" },
    RECORDPASS: { code: 13, zh_CN: "备案通过", en_US: "RECORDPASS" },
    RECORDUNPASS: { code: 14, zh_CN: "备案不通过", en_US: "RECORDUNPASS" },
    SALEON: { code: 15, zh_CN: "上架", en_US: "SALEON" },
    SALEOFF: { code: 16, zh_CN: "下架", en_US: "SALEOFF" },
    ACT: { code: 17, zh_CN: "启用", en_US: "ACT" },
    UNACT: { code: 18, zh_CN: "停用", en_US: "UNACT" },

    SEND: { code: 19, zh_CN: "发送", en_US: "SEND" },
    RECEIVE: { code: 20, zh_CN: "接收", en_US: "RECEIVE" },
    OPEN: { code: 21, zh_CN: "打开", en_US: "OPEN" },
    CLOSE: { code: 22, zh_CN: "关闭", en_US: "CLOSE" },
    READ: { code: 23, zh_CN: "已读", en_US: "READ" },
    CONFIRM: { code: 24, zh_CN: "确认", en_US: "CONFIRM" },
    COMPLETE: { code: 25, zh_CN: "完成", en_US: "COMPLETE" },
    FAILURE: { code: 26, zh_CN: "失败", en_US: "FAILURE" },
    CANCEL: { code: 27, zh_CN: "取消", en_US: "CANCEL" },
  },
};


const ViewEnum = {
  // Code
  Code: {
    SUCCESS: { code: 0, desc: '成功' },
    NOLOGIN: { code: 1, desc: '未登录' },
    INFO: { code: 2, desc: '信息' },
    ERROR: { code: 3, desc: '错误' },
    EXCEPTION: { code: 4, desc: '异常' },
  },
};

const ShowEnum = {
  ShowNavType: {
    0: { zh_CN: "无数据", en_US: "NOTHING" },
    1: { zh_CN: "部分商品", en_US: "PRODUCT" },
    2: { zh_CN: "部分品牌", en_US: "BRAND" },
    3: { zh_CN: "部分分类", en_US: "CATEGORY" },
    undefined: { zh_CN: "", en_US: "" },
  },
  ShowNavType_POS: {
    PRODUCT: {code:1, zh_CN: "部分商品", en_US: "PRODUCT" },
    BRAND: { code:2,zh_CN: "部分品牌", en_US: "BRAND" },
    CATEGORY: { code:3,zh_CN: "部分分类", en_US: "CATEGORY" },
  },
};

const UrlEnum = {
  ProductAPI: generateUrls({ BASE_URL: "/product", zh_CN: "商品", en_US: "product" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "REVERT", "LOCK", "UNLOCK", "SALEON", "SALEOFF", "CHECKPASS", "CHECKUNPASS", "RECORD", "RE_RECORD", "RECORDPASS", "RECORDUNPASS"]),
  SeriesAPI: generateUrls({ BASE_URL: "/series", zh_CN: "系列商品", en_US: "series" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "REVERT", "LOCK", "UNLOCK", "CHECKPASS", "CHECKUNPASS"]),
  CategoryAttributeAPI: generateUrls({ BASE_URL: "/categoryattribute", zh_CN: "分类属性", en_US: "categoryattribute" }, ["LIST", "FORM", "INSERT", "UPDATE", "REMOVE", "LOCK", "UNLOCK"]),
  ValueAPI: generateUrls({ BASE_URL: "/value", zh_CN: "属性值", en_US: "value" }, ["LIST", "FORM", "INSERT", "UPDATE", "REMOVE", "LOCK", "UNLOCK"]),
  AttributeAPI: generateUrls({ BASE_URL: "/attribute", zh_CN: "属性", en_US: "attribute" }, ["LIST", "FORM", "INSERT", "UPDATE", "REMOVE", "LOCK", "UNLOCK"]),
  AttributeValueAPI: generateUrls({ BASE_URL: "/attributevalue", zh_CN: "属性和属性值", en_US: "attributevalue" }, ["LIST"]),
  BrandAPI: generateUrls({ BASE_URL: "/brand", zh_CN: "品牌", en_US: "brand" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "REVERT", "LOCK", "UNLOCK"]),
  BrandSupplierAPI: generateUrls({ BASE_URL: "/brandsupplier", zh_CN: "商家品牌", en_US: "brandsupplier" }, ["LIST", "INSERT", "REMOVE", "LOCK", "UNLOCK", "CHECKPASS", "CHECKUNPASS"]),
  UnitAPI: generateUrls({ BASE_URL: "/unit", zh_CN: "单位", en_US: "unit" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "REVERT", "LOCK", "UNLOCK"]),
  UnitConvertAPI: generateUrls({ BASE_URL: "/unitconvert", zh_CN: "单位换算", en_US: "unitconvert" }, ["LIST", "FORM", "INSERT", "UPDATE", "REMOVE"]),
  CategoryAPI: generateUrls({ BASE_URL: "/category", zh_CN: "分类", en_US: "category" }, ["LIST"]),

  OrderAPI: generateUrls({ BASE_URL: "/order", zh_CN: "订单", en_US: "order" }, ["LIST", "DELETE", "REMOVE", "REVERT", "CLOSE", "SEND"]),
  OrderServiceAPI: generateUrls({ BASE_URL: "/orderservice", zh_CN: "售后", en_US: "orderservice" }, ["LIST", "CLOSE", "CONFIRM", "COMPLETE"]),

  WarehouseAPI: generateUrls({ BASE_URL: "/warehouse", zh_CN: "仓库", en_US: "warehouse" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "REVERT", "LOCK", "UNLOCK", "CHECKPASS", "CHECKUNPASS"]),
  ShipModeAPI: generateUrls({ BASE_URL: "/shipmode", zh_CN: "配送方式", en_US: "shipmode" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "REVERT", "LOCK", "UNLOCK"]),
  ShipTemplateAPI: generateUrls({ BASE_URL: "/shiptemplate", zh_CN: "配送模板", en_US: "shiptemplate" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "REVERT", "LOCK", "UNLOCK"]),
  ExpressAPI: generateUrls({ BASE_URL: "/express", zh_CN: "快递", en_US: "express" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "REVERT", "LOCK", "UNLOCK"]),
  ExpressSupplierAPI: generateUrls({ BASE_URL: "/expresssupplier", zh_CN: "商家快递", en_US: "expresssupplier" }, ["LIST", "INSERT", "REMOVE", "LOCK", "UNLOCK", "CHECKPASS", "CHECKUNPASS"]),

  LetterAPI: generateUrls({ BASE_URL: "/letter", zh_CN: "站内信", en_US: "letter" }, ["LIST", "DELETE", "REMOVE", "REVERT", "READ", "DETAIL"]),
  ReviewAPI: generateUrls({ BASE_URL: "/review", zh_CN: "评价", en_US: "review" }, ["LIST", "CHECKPASS", "CHECKUNPASS", "TOP", "UNTOP", "SHOW", "UNSHOW"]),

  CouponAPI: generateUrls({ BASE_URL: "/coupon", zh_CN: "优惠券", en_US: "coupon" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "LOCK", "UNLOCK", "ACT", "UNACT"]),
  GroupBuyAPI: generateUrls({ BASE_URL: "/groupbuy", zh_CN: "团购", en_US: "groupbuy" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "LOCK", "UNLOCK", "CHECKPASS", "CHECKUNPASS", "ACT", "UNACT"]),
  PromotionAPI: generateUrls({ BASE_URL: "/promotion", zh_CN: "促销购", en_US: "promotion" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "LOCK", "UNLOCK", "CHECKPASS", "CHECKUNPASS", "ACT", "UNACT"]),
  CountDownAPI: generateUrls({ BASE_URL: "/countdown", zh_CN: "限时购", en_US: "countdown" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "LOCK", "UNLOCK", "CHECKPASS", "CHECKUNPASS", "ACT", "UNACT"]),
  GroupAPI: generateUrls({ BASE_URL: "/group", zh_CN: "商品组合", en_US: "group" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "LOCK", "UNLOCK", "CHECKPASS", "CHECKUNPASS", "ACT", "UNACT"]),
  SpecialAPI: generateUrls({ BASE_URL: "/special", zh_CN: "特价", en_US: "special" }, ["LIST", "FORM", "UPDATE", "ACT", "UNACT"]),

  RoleAPI: generateUrls({ BASE_URL: "/role", zh_CN: "角色", en_US: "role" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "LOCK", "UNLOCK"]),
  ManagerAPI: generateUrls({ BASE_URL: "/manager", zh_CN: "管理员", en_US: "manager" }, ["LIST", "FORM", "INSERT", "UPDATE", "REMOVE"]),// 目前没有remove api
  ManagerLogAPI: generateUrls({ BASE_URL: "/managerlog", zh_CN: "管理日志", en_US: "managerlog" }, ["LIST", "REMOVE"]),

  ShowNavAPI: generateUrls({ BASE_URL: "/shownav", zh_CN: "显示分类", en_US: "show nav" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "LOCK", "UNLOCK"]),
  ShowNavGroupAPI: generateUrls({ BASE_URL: "/shownavgroup", zh_CN: "显示分类组", en_US: "show nav group" }, ["LIST", "FORM", "INSERT", "UPDATE", "REMOVE", "LOCK", "UNLOCK", "ACT", "UNACT"]),
  ModuleAPI:generateUrls({ BASE_URL: "/module", zh_CN: "模板", en_US: "module" }, ["LIST", "FORM", "INSERT", "UPDATE", "DELETE", "REMOVE", "REVERT", "LOCK", "UNLOCK", "SALEON", "SALEOFF", "CHECKPASS", "CHECKUNPASS"]),


  MAccountAPI: {
    BASE_URL: "/user",
    GET_PUBLICK_KEY: { url: "/user/get_encrypt_with_pwd", desc: { zh_CN: "获取公钥", en_US: "get the public key" } },
    VERIFY_POHNE_CAPTCHA: { url: "/user/verify_code_by_phone", desc: { zh_CN: "验证手机验证码", en_US: "verify captcha of webpage" } },
    VERIFY_WEBPAGE_CAPTCHA: { url: "/user/verify_code_by_page", desc: { zh_CN: "验证网页验证码", en_US: "verify captcha of phone" } },
    GET_POHNE_CAPTCHA: { url: "/user/get_code_by_phone", desc: { zh_CN: "获取手机验证码", en_US: "get captcha of webpage" } },
    GET_WEBPAGE_CAPTCHA: { url: "/user/get_code_by_page", desc: { zh_CN: "获取网页验证码", en_US: "get captcha of phone" } },
  },

  AccountAPI: {
    BASE_URL: "/account",
    // LOGIN: { url: "/account/login", desc: { zh_CN: "登录", en_US: "login" } },
    // LOGOUT: { url: "/account/logout", desc: { zh_CN: "注销", en_US: "logout" } },
    REGISTER: { url: "/api/account/register", desc: { zh_CN: "注册", en_US: "register" } },
    LOGIN: { url: "/api/account/login", desc: { zh_CN: "登录", en_US: "login" } },
    LOGOUT: { url: "/api/account/logout", desc: { zh_CN: "注销", en_US: "logout" } },
  },

  
  UserArticleAPI:{
    BASE_URL: "/user/article",
    LIST:{ url: "/api/user/article/list", desc: { zh_CN: "获取文章列表", en_US: "getList" } },
    CONTENT:{ url: "/api/user/article/content", desc: { zh_CN: "获取内容", en_US: "getContent" } },
  },
  UserCateAPI:{
    BASE_URL: "/user/cate",
    LIST:{ url: "/api/user/cate/list", desc: { zh_CN: "获取分类列表", en_US: "getList" } },
  },


  CommentAPI:{
    LIST: { url: "/api/admin/comment/list", desc: { zh_CN: "获取一级列表", en_US: "getList" } },
    DELETE: { url: "/api/admin/comment/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } },
    INSERT:{url: "/api/admin/comment/insert", desc: { zh_CN: "添加", en_US: "insert" }},
    SHOW:{url: "/api/admin/comment/show",desc: { zh_CN: "显示", en_US: "show" }, actionTip: { zh_CN: "将被展示，展示后可重新隐藏！", en_US: "will be shown,and then can be hidden after being shown!" } },
    UNSHOW:{url: "/api/admin/comment/unshow", desc: { zh_CN: "隐藏", en_US: "hide" }, actionTip: { zh_CN: "将被隐藏，隐藏后可重新设置显示！", en_US: "will be hidden,and then can be shown after being hidden!" }},
  }
}




export { CommonEnum, MarketEnum, MemberEnum, MessageEnum, OrderEnum, ProductEnum,ShowEnum, SystemEnum, ViewEnum, UrlEnum };
