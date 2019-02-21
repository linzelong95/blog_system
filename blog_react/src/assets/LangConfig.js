
const LangConfig={
  // 如果有机会的话，在字段加COMMON_，避免与其他地方发生命名冲突
  CommonLang:{
    YES:{zh_CN: '是',en_US:"yes"},
    NO:{zh_CN: '否',en_US:"no"},
    CONFIRM:{zh_CN: '确定',en_US:"confirm"},
    CANCEL:{zh_CN: '取消',en_US:"cancel"},
    SUBMIT:{zh_CN: '提交',en_US:"submit"},
    SAVE_AS_DRAFT:{zh_CN: '存为草稿',en_US:"save as draft"},
    NEW:{zh_CN: '新建',en_US:"new"},
    EXPORT:{zh_CN: '导出',en_US:"export"},
    CLEAR:{zh_CN: '清空',en_US:"clear"},
    BATCH_OPERATION:{zh_CN: '批量操作',en_US:"batch operation"},
    QUERY:{zh_CN: '查询',en_US:"query"},
    RESET:{zh_CN: '重置',en_US:"reset"},
    FOLD_UP:{zh_CN: '收起',en_US:"fold up"},
    OPEN_UP:{zh_CN: '展开',en_US:"open up"},
    IS_ENABLE:{zh_CN: '是否可用',en_US:"available?"},
    IS_UNDONO:{zh_CN: '是否待做',en_US:"undone?"},
    IS_RECYCLE:{zh_CN: '是否回收',en_US:"recycle?"},
    SHOW_ALL:{zh_CN: '显示全部',en_US:"show all"},
    SHOW_AVAILABLE:{zh_CN: '只显示可用项',en_US:"just show avalanche ones"},
    SHOW_UNDONO:{zh_CN: '只显示待做项',en_US:"just show undone ones"},
    SHOW_RECYCLE:{zh_CN: '只显示回收项',en_US:"just show recycle ones"},
    ACTION:{zh_CN: '操作',en_US:"action"},
    STATUS:{zh_CN: '状态',en_US:"status"},
    NAME:{zh_CN: '名称',en_US:"name"},
    TYPE:{zh_CN: '类型',en_US:"type",require:{zh_CN: '请选择类型!',en_US:"type is required"}},
    IP:{zh_CN: "IP",en_US:"IP"},
    LOCK_BY_PLATFORM:{zh_CN: '平台锁定',en_US:"locked by platform"},
    OWNER_ID:{zh_CN: '商家ID',en_US:"owner ID",require:{zh_CN: '请输入商家ID!',en_US:"owner id is required"}},
    OWNER_NAME:{zh_CN: '商家名',en_US:"owner name"},
    OWNER_TYPE:{zh_CN: '商家类型',en_US:"owner type"},
    MANAGER_TYPE:{zh_CN: '管理员类型',en_US:"manager type",require:{zh_CN: '请选择管理员类型!',en_US:"manager type is required"}},
    ADMIN:{zh_CN: '管理员',en_US:"admin",require:{zh_CN: '请选择管理员!',en_US:"admin is required"}},
    REMARK:{zh_CN: '备注',en_US:"remark",require:{zh_CN: '请输入备注!',en_US:"remark is required"}},
    SEQUENCE:{zh_CN: '排序',en_US:"sequence"},
    PLATFORM:{zh_CN: '平台',en_US:"plateform"},
    MERCHANT:{zh_CN: '商家',en_US:"merchant"},
    TITLE:{zh_CN: '标题',en_US:"title",require:{zh_CN: '请输入标题!',en_US:"title is required"}},
    // CONTENT:{zh_CN: '内容',en_US:"content",require:{zh_CN: '请输入内容!',en_US:"content is required"}},
    INSERT_DATE:{zh_CN: '添加日期',en_US:"inserted date"},
    INSERT_CREATOR:{zh_CN: '添加者',en_US:"creator"},
    VALID_TIME:{zh_CN: '有效期',en_US:"valid time"},
    DESCRIPTION:{zh_CN: '描述',en_US:"description"},
    USE:{zh_CN: '使用',en_US:"use"},
    PHONE:{zh_CN: '联系方式',en_US:"phone"},
    EMAIL:{zh_CN: '邮箱',en_US:"E-mail"},
    MULTIPLE_SELECTION:{zh_CN: '多选',en_US:"multiple selection"},
    SINGLE_SELECTION:{zh_CN: '单选',en_US:"single selection"},
    CLOSE:{zh_CN: '关闭',en_US:"Close"},
    DROP:{zh_CN: '退选',en_US:"drop"},
    ICONFONT:{zh_CN: '图标',en_US:"iconfont",require:{zh_CN: '请选择图标!',en_US:"iconfont is required"}},
    CONDITIONSELECTITION:{zh_CN: '条件选择',en_US:"condition selection"},
    PICTURE_UPLOAD_FAIL:{zh_CN: '图片上传失败，请反馈！',en_US:"Picture upload failed. Please feedback to the administrator."},
    PROPERTY_NO_MODIFY:{zh_CN: '该属性不可修改！',en_US:"This property can't be modified."},
    // NO_OPERATION_AUTHORITY:{zh_CN: '无操作权限！',en_US:"no operation authority"},
    // NOTHING:{zh_CN: '无',en_US:"nothing"},
    DELIVERY_DATE:{zh_CN: '发送时间',en_US:"date of delivery"},
    NO_DESC:{zh_CN: '无描述',en_US:"no description"},
    NO_PIC:{zh_CN: '无图片',en_US:"no picture"},
  },
  GlobalHeaderLang:{
    GLOBALHEADER_INFO:{zh_CN: '通知',en_US:"Info"},
    GLOBALHEADER_REVIEW:{zh_CN: '评价',en_US:"Review"},
    GLOBALHEADER_EVENT:{zh_CN: '待办',en_US:"Event"},
  },
  WarehouseLang:{
    WAREHOUSE_SEARCH:{zh_CN: '仓库搜索',en_US:"warehouse"},
    WAREHOUSE_NAME:{zh_CN: '仓库名',en_US:"warehouse name",require:{zh_CN: '请输入仓库名!',en_US:"warehouse name is required"}},
    WAREHOUSE_CODE:{zh_CN: '仓库编码',en_US:"warehouse code",require:{zh_CN: '请输入仓库编码!',en_US:"warehouse code is required"}},
    WAREHOUSE_REGION:{zh_CN: '所属区域',en_US:"location",require:{zh_CN: '请选择所属区域！',en_US:"location is required"}},
    WAREHOUSE_PROVINCE:{zh_CN: '可发省份',en_US:"available provinces",require:{zh_CN: '请选择可发省份！',en_US:"available provinces is required"}},
    WAREHOUSE_ADDRESS:{zh_CN: '具体地址',en_US:"specific address",require:{zh_CN: '请输入具体地址!',en_US:"specific address is required"}},
    WAREHOUSE_SHIPPER:{zh_CN: '联系人',en_US:"shipper",require:{zh_CN: '请输入联系人!',en_US:"shipper is required"}},
    WAREHOUSE_PHONE:{zh_CN: '电话',en_US:"phone",require:{zh_CN: '请输入联系电话!',en_US:"phone is required"}},
    WAREHOUSE_AGENT:{zh_CN: '代报关',en_US:"agent customs"},
    WAREHOUSE_SELECT:{zh_CN: '仓库',en_US:"warehouse",require:{zh_CN: '请选择仓库范围!',en_US:"active warehouse is required"}},
  },
  ExpressLang:{
    EXPRESS_SEARCH:{zh_CN: '快递搜索',en_US:"express"},
    EXPRESS_CODE_SEARCH:{zh_CN: '快递码搜索',en_US:"express code"},
    EXPRESS_NAME:{zh_CN: '快递名',en_US:"express name"},
    EXPRESS_CODE:{zh_CN: '快递100代码',en_US:"express code"},
    EXPRESS_OWNER_ID:{zh_CN: '商家ID',en_US:"owner id"},
    EXPRESS_INSERT:{zh_CN: '添加快递',en_US:"express",require:{zh_CN: '请选择或搜索可用快递!',en_US:"express is required"}},
    EXPRESS_SELECT:{zh_CN: '快递',en_US:"express",require:{zh_CN: '请选择快递!',en_US:"active express is required"}},
  },
  ExpressSupplierLang:{
    EXPRESSSUPPLIER_SEARCH:{zh_CN: '快递搜索',en_US:"express"},
    EXPRESSSUPPLIER_NAME:{zh_CN: '快递名',en_US:"express name"},
    EXPRESSSUPPLIER_CODE_SEARCH:{zh_CN: '快递码搜索',en_US:"express code"},
    EXPRESSSUPPLIER_CODE:{zh_CN: '快递100代码',en_US:"express code"},
    EXPRESSSUPPLIER_SELECT:{zh_CN: '快递',en_US:"express",require:{zh_CN: '请选择快递!',en_US:"active express is required"}},
  },
  ShipTemplateLang:{
    SHIPTEMPLATE_SEARCH:{zh_CN: '模板搜索',en_US:"template"},
    SHIPTEMPLATE_NAME:{zh_CN: '模板名',en_US:"template name",require:{zh_CN: '请输入模板名!',en_US:"template name is required"}},
    SHIPTEMPLATE_INIT_WEIGHT_AND_PRICE:{zh_CN: '首重及价格',en_US:"init weight & price "},
    SHIPTEMPLATE_ADDITONAL_WEIGHT_AND_PRICE:{zh_CN: '加重及价格',en_US:"additional weight & price "},
    SHIPTEMPLATE_COMMON_SETTING:{zh_CN: '通用设置',en_US:"common setting"},
    SHIPTEMPLATE_ADDITIONAL_SETTING:{zh_CN: '附加设置',en_US:"additional setting"},
    SHIPTEMPLATE_ADDITIONAL_SETTING_TIP:{zh_CN: '可添加多种情况，每种须包含【省份】【首重价】【加重价】',en_US:"Here you can add some special conditions, and remmenber that each condition needs including 【province】【price of first weight】【price of additional weight】"},
    SHIPTEMPLATE_SWQUENCE:{zh_CN: '模板排序',en_US:"sequence"},
    SHIPTEMPLATE_WEIGHT:{zh_CN: '首重/g',en_US:"first weight",require:{zh_CN: '请输入首重!',en_US:"first weight is required"}},
    SHIPTEMPLATE_PRICE:{zh_CN: '首重价格',en_US:"first price",require:{zh_CN: '请输入首重价格!',en_US:"price of first weight is required"}},
    SHIPTEMPLATE_ADD_WEIGHT:{zh_CN: '加重/g',en_US:"additional weight",require:{zh_CN: '请输入加重!',en_US:"additional weight is required"}},
    SHIPTEMPLATE_ADD_PRICE:{zh_CN: '加重价格',en_US:"additional price",require:{zh_CN: '请输入加重价格!',en_US:"price of additional weight is required"}},
    SHIPTEMPLATE_SPECIAL_PROVINCE:{zh_CN: '特殊省份',en_US:"special province"},
    SHIPTEMPLATE_SELECT:{zh_CN: '配送模板',en_US:"ship template",require:{zh_CN: '请选择配送模板!',en_US:"ship template is required"}},
    SHIPTEMPLATE_REPEAT_TIP:{zh_CN: '该组已设置过，请勿重复设置！',en_US:"This group has been set. Don't set it again!"},
    SHIPTEMPLATE_COVER_TIP:{zh_CN: '该组包含先前已设置好的组，将覆盖先前的组，确定覆盖吗？',en_US:"This group includes other group(s) having been set. Do you want to cover it(them)?"},
  },
  ShipModeLang:{
    SHIPMODE_SEARCH:{zh_CN: '配送名搜索',en_US:"ship mode"},
    SHIPMODE_NAME:{zh_CN: '配送名',en_US:"ship mode name",require:{zh_CN: '请输入配送方式名!',en_US:"ship mode name is required"}},
    SHIPMODE_PRIVATE_NAME:{zh_CN: '显示名称',en_US:"private name",require:{zh_CN: '请输入显示名称!',en_US:"private name is required"}},
    SHIPMODE_OPETATE_COSE:{zh_CN: '处理费',en_US:"operate cost",require:{zh_CN: '请输入处理费!',en_US:"operate cost is required"}},
    SHIPMODE_TEMPLATE:{zh_CN: '物流模板',en_US:"template",require:{zh_CN: '请选择或搜索可用物流模板!',en_US:"template is required"}},
    SHIPMODE_EXPRESS:{zh_CN: '快递',en_US:"express",require:{zh_CN: '请选择或搜索可用快递!',en_US:"express is required"}},
    SHIPMODE_SELECT:{zh_CN: '配送方式',en_US:"ship mode",require:{zh_CN: '请选择配送方式!',en_US:"ship mode is required"}},
  },
  ReviewLang:{
    REVIEW_PRODUCT:{zh_CN: '商品',en_US:"product"},
    REVIEW_LEVEL:{zh_CN: '评级',en_US:"level"},
    REVIEW_COMMENT:{zh_CN: '评论',en_US:"comment"},
    REVIEW_PICTURE:{zh_CN: '评论图片',en_US:"pic"},
    REVIEW_IS_ADDITIONAL_COMMENT:{zh_CN: '是否追评',en_US:"is additional comment"},
    REVIEW_ADDITIONAL_COMMENT:{zh_CN: '追评内容',en_US:"additional comment"},
    REVIEW_ADDITIONAL_PICTURE:{zh_CN: '追评图片',en_US:"additional pic"},
    REVIEW_ACCOUNT:{zh_CN: '用户账号',en_US:"account"},
    REVIEW_NAME:{zh_CN: '商品评价',en_US:"review"},
    REVIEW_GIVE_FIRST_COMMENT:{zh_CN: '评价了',en_US:"commented on"},
    REVIEW_GIVE_SECOND_COMMENT:{zh_CN: '追评了',en_US:"commented secondly on"},
  },
  LetterLang:{
    LETTER_SEARCH:{zh_CN: '标题搜索',en_US:"letter title"},
    LETTER_READ_DATE:{zh_CN: '已读日期',en_US:"date of read"},
  },
  CountDownLang:{
    COUNTDOWN_SEARCH:{zh_CN: '限时购搜索',en_US:"count down"},
    COUNTDOWN_NAME:{zh_CN: '限时购名',en_US:"count down name",require:{zh_CN: '请输入限时购名!',en_US:"count down name is required"}},
    COUNTDOWN_LIMITED_PRICE:{zh_CN: '限时价',en_US:"limited price",require:{zh_CN: '请输入限时价!',en_US:"limited price is required"}},
    COUNTDOWN_PRODUCT:{zh_CN: '商品',en_US:"product"},
  },
  CouponLang:{
    COUPON_SEARCH:{zh_CN: '优惠券搜索',en_US:"coupon"},
    COUPON_NAME:{zh_CN: '优惠券名',en_US:"coupon name",require:{zh_CN: '请输入团购名!',en_US:"group buy name is required"}},
    COUPON_DISCOUNTS:{zh_CN: '优惠情况',en_US:"discounts"},
    COUPON_RECEPTION:{zh_CN: '领用',en_US:"reception"},
    COUPON_IS_OPEN:{zh_CN: '是否公开',en_US:"is open"},
    COUPON_IS_FIRST:{zh_CN: '是否首单',en_US:"is first"},
    COUPON_PICTURE:{zh_CN: '图片',en_US:"picture"},
    COUPON_AMOUNT:{zh_CN: '满足金额',en_US:"satisfied amount",require:{zh_CN: '请输入满足金额!',en_US:"satisfied amount is required"}},
    COUPON_DISCOUNT:{zh_CN: '抵扣金额',en_US:"discount",require:{zh_CN: '请输入抵扣金额!',en_US:"discount is required"}},
  },
  GroupBuyLang:{
    GROUPBUY_SEARCH:{zh_CN: '团购名搜索',en_US:"group buy"},
    GROUPBUY_NAME:{zh_CN: '团购名',en_US:"group buy name",require:{zh_CN: '请输入团购名!',en_US:"group buy name is required"}},
    GROUPBUY_PRICE:{zh_CN: '团购价',en_US:"group buy price",require:{zh_CN: '请输入团购价!',en_US:"group buy price is required"}},
    GROUPBUY_PARTICIPANTS:{zh_CN: '参团人数',en_US:"number of participants"},
    GROUPBUY_PERSONAL_RESTRICTION:{zh_CN: '单人限购',en_US:"personal restriction",require:{zh_CN: '请输入单人限购数量!',en_US:"personal restriction is required"}},
    GROUPBUY_QUANTITY:{zh_CN: '团购数量',en_US:"group buy quantity",require:{zh_CN: '请输入团购数量!',en_US:"group buy quantity is required"}},
    GROUPBUY_PRODUCT_COUNT:{zh_CN: '商品总数',en_US:"product counts",require:{zh_CN: '请输入商品总数!',en_US:"product counts is required"}},
  },
  GroupLang:{
    GROUP_SEARCH:{zh_CN: '组合名搜索',en_US:"group buy"},
    GROUP_NAME:{zh_CN: '组合名',en_US:"group name",require:{zh_CN: '请输入团购名!',en_US:"group name is required"}},
    GROUP_PRICE:{zh_CN: '组合价',en_US:"group price",require:{zh_CN: '请输入组合价!',en_US:"group price is required"}},
  },
  PromotionLang:{
    PROMOTION_SEARCH:{zh_CN: '促销购搜索',en_US:"promotion"},
    PROMOTION_NAME:{zh_CN: '促销名',en_US:"promotion name",require:{zh_CN: '请输入促销名!',en_US:"promotion name is required"}},
    PROMOTION_ADDS_AREA:{zh_CN: '添加商品组',en_US:"add product group"},
    PROMOTION_ADDS_TIP:{zh_CN: 'tip: 可添加多组，每组须包含【商品】【加价】【主题】',en_US:"Here you can add some product groups, and remember that each group needs including 【product】【additional price】【theme】"},
    PROMOTION_ADDS_THEME:{zh_CN: '活动主题',en_US:"activity theme"},
    PROMOTION_ADDS_PRICE:{zh_CN: '加价',en_US:"additional price"},
    PROMOTION_AMOUNT:{zh_CN: '满足金额',en_US:"satisfied amount",require:{zh_CN: '请输入满足金额!',en_US:"satisfied amount is required"}},
    PROMOTION_DISCOUNT:{zh_CN: '折扣',en_US:"discount",require:{zh_CN: '请输入折率或满减!',en_US:"discount is required"}},
    PROMOTION_DISCOUNT_PLACEHOLDER:{zh_CN: '满减/折扣率',en_US:"preferential amount/discount rate",require:{zh_CN: '请输入折率或满减!',en_US:"discount is required"}},
    PROMOTION_DISCOUNT_TYPE:{zh_CN: '折扣类型',en_US:"discount type",require:{zh_CN: '请选择折扣类型!',en_US:"discount type is required"}},
    PROMOTION_QUANTITY:{zh_CN: '数量',en_US:"quantity",require:{zh_CN: '请输入活动数量!',en_US:"quantity is required"}},
    PROMOTION_ADDS_WARNNING:{zh_CN: '请至少添加一组加价购活动！',en_US:"Please add one increasing purchase at least!"},
  },
  SpecialLang:{
    SPECIAL_PRICE:{zh_CN: '特价',en_US:"special price",require:{zh_CN: '请输入特价!',en_US:"special price is required"}},
    SPECIAL_IS_ACT:{zh_CN: '是否启用',en_US:"act or not"},
  },
  ProductLang:{
    PRODUCT_SEARCH:{zh_CN: '商品搜索',en_US:"product"},
    PRODUCT_NAME:{zh_CN: '商品名称',en_US:"product name",require:{zh_CN: '请输入商品名称!',en_US:"product name is required"}},
    PRODUCT_SUBTITLE:{zh_CN: '副标题',en_US:"subtitle"},
    PRODUCT_BAR_CODES:{zh_CN: '条形码 ',en_US:"bar_codes"},
    PRODUCT_CODE:{zh_CN: '编码',en_US:"code"},
    PRODUCT_SPECIFICATION:{zh_CN: '规格',en_US:"specification",require:{zh_CN: '请输入商品规格!',en_US:"specification is required"}},
    PRODUCT_MODEL:{zh_CN: '型号',en_US:"model",require:{zh_CN: '请输入商品型号!',en_US:"model is required"}},
    PRODUCT_GROSS_WEIGHT:{zh_CN: '毛重',en_US:"gross weight"},
    PRODUCT_NET_WEIGHT:{zh_CN: '净重',en_US:"net weight"},
    PRODUCT_WIDTH:{zh_CN: '宽度',en_US:"width"},
    PRODUCT_HEIGHT:{zh_CN: '高度',en_US:"height"},
    PRODUCT_LENGTH:{zh_CN: '长度',en_US:"length"},
    PRODUCT_SALE_STATUS:{zh_CN: '销售状态',en_US:"sale status",require:{zh_CN: '请选择销售状态!',en_US:"sale status is required"}},
    PRODUCT_SALE_PRICE:{zh_CN: '售价',en_US:"sale price",require:{zh_CN: '请输入销售价!',en_US:"sale price is required"}},
    PRODUCT_SPECIAL_PRICE:{zh_CN: '特价',en_US:"special price",require:{zh_CN: '请输入特价!',en_US:"special price is required"}},
    PRODUCT_MARKET_PRICE:{zh_CN: '市场价',en_US:"market price"},
    PRODUCT_COST_PRICE:{zh_CN: '成本价',en_US:"cost price",require:{zh_CN: '请输入成本价!',en_US:"cost price is required"}},
    PRODUCT_VIEWS:{zh_CN: '浏览量',en_US:"views"},
    PRODUCT_SALE_COUNTS:{zh_CN: '销售量',en_US:"sale counts"},
    PRODUCT_COMMENT_COUNTS:{zh_CN: '评论量',en_US:"comment counts"},
    PRODUCT_DISCOUNT_SHARE:{zh_CN: '同享优惠',en_US:"discount share"},
    PRODUCT_SELECT:{zh_CN: '商品',en_US:"product",require:{zh_CN: '请选择活动商品!',en_US:"active product is required"}},
    PRODUCT_USING_MARKET_PRICE:{zh_CN: '启用特价',en_US:"using special price"},
    PRODUCT_FREE_EXCHANGE:{zh_CN: '七天包退',en_US:"free exchange"},
    PRODUCT_QUALITY_GUARANTEE:{zh_CN: '正品保障',en_US:"quality guarantee"},
    PRODUCT_OFFER_INVOICE:{zh_CN: '提供发票',en_US:"offer invoice"},
    PRODUCT_TAX_FARMING:{zh_CN: '是否包税',en_US:"tax gross-up"},
    PRODUCT_NO_PROMOTION:{zh_CN: '禁止促销',en_US:"No promotion"},
    PRODUCT_DETAIL:{zh_CN: '商品详情',en_US:"product detail"},
    PRODUCT_DISTRIBUTION_INSTRUCTION:{zh_CN: '配送说明',en_US:"Distribution desc"},
    PRODUCT_AFTER_SERVICE:{zh_CN: '售后服务',en_US:"after-sale service"},
    PRODUCT_PICTURE:{zh_CN: '商品图片',en_US:"picture"},
    PRODUCT_RECORD:{zh_CN: '商品备案',en_US:"put on record"},
    PRODUCT_ORIGIN:{zh_CN: '产地',en_US:"origin"},
    PRODUCT_EXPIRY_DATE:{zh_CN: '保质期',en_US:"expiry date"},
    PRODUCT_FACTORY:{zh_CN: '生产厂家',en_US:"factory"},
    PRODUCT_DESC:{zh_CN: '商品描述',en_US:"product desc"},
    PRODUCT_RECORD_COUNT:{zh_CN: '备案数量',en_US:"record count"},
    PRODUCT_RECORD_PRICE:{zh_CN: '备案价格',en_US:"record price"},
    PRODUCT_RECORD_CODE:{zh_CN: '备案编码',en_US:"record code"},
    PRODUCT_RECORD_RATE:{zh_CN: '综合税税率',en_US:"record rate"},
    PRODUCT_RECORD_RATE2:{zh_CN: '第二综合税税率',en_US:"record rate2"},
    PRODUCT_RECORD_BENCHMARK:{zh_CN: '第二综合税税率价格基准',en_US:"benchmark"},
    PRODUCT_RECORD_UNIT_COUNT2:{zh_CN: '第二综合税税率单位数量',en_US:"unit count2"},
    PRODUCT_RECORD_NO:{zh_CN: '国检备案号',en_US:"record number"},
    PRODUCT_RECORD_RATE_SELL:{zh_CN: '销售商佣金比例',en_US:"seller rate sell"},
    PRODUCT_IS_EXCLUDE_ACTIVITY:{zh_CN: '非活动商品',en_US:"Inactive commodity?"},
    PRODUCT_RECORD_TIP:{zh_CN: '当您选择自主备案时，请填写所有信息！',en_US:"Please fill in all information when you record product by yourself."},
    PRODUCT_PLATFORM_RECORD_TIP:{zh_CN: '备案信息填写',en_US:"the information of record"},
    PRODUCT_RECORD_BY_SELF:{zh_CN: '自主备案',en_US:"record by self"},
    PRODUCT_NO_RECORD:{zh_CN: '无需备案',en_US:"needn't record"},
    PRODUCT_UNEDITABLE_AFTER_SUBMIT:{zh_CN: '提交后不可再编辑，确定提交吗？',en_US:"It will be uneditable after being submitted.Are you sure to submit it?"},
  },
  BrandLang:{
    BRAND_SEARCH:{zh_CN: '品牌搜索',en_US:"brand"},
    BRAND_NAME:{zh_CN: '品牌名',en_US:"brand name",require:{zh_CN: '请输入品牌名!',en_US:"brand name is required"}},
    BRAND_LOGO:{zh_CN: 'Logo',en_US:"Logo"},
    BRAND_NAME_CN:{zh_CN: '中文名',en_US:"Chinese name",require:{zh_CN: '请输入品牌中文名!',en_US:"Chinese name of brand is required"}},
    BRAND_NAME_EN:{zh_CN: '英文名',en_US:"English name",require:{zh_CN: '请输入品牌英文名!',en_US:"English name of brand is required"}},
    BRAND_ALIAS:{zh_CN: '别名',en_US:"alias",require:{zh_CN: '请输入品牌别名!',en_US:"alias of brand is required"}},
    BRAND_COMPANY_URL:{zh_CN: '官网链接',en_US:"company url" ,require:{zh_CN: '请输入官网链接!',en_US:"company url is required"}},
    BRAND_SELECT:{zh_CN: '品牌',en_US:"brand",require:{zh_CN: '请选择活动品牌!',en_US:"active brand is required"}},
    BRAND_VOUCHER:{zh_CN: '授权链接',en_US:"delegated url",require:{zh_CN: '请输入授权链接!',en_US:"delegated url is required"}},
    BRAND_META_TITLE:{zh_CN: 'seo标题',en_US:"meta title",require:{zh_CN: '请输入seo标题!',en_US:"meta title is required"}},
    BRAND_META_KEYS:{zh_CN: 'seo关键字',en_US:"meta keys",require:{zh_CN: '请输入seo关键字!',en_US:"meta keys is required"}},
    BRAND_META_DESC:{zh_CN: 'seo描述',en_US:"meta desc",require:{zh_CN: '请输入seo描述!',en_US:"meta desc is required"}},
    BRAND_THEME:{zh_CN: '主题模板',en_US:"theme",require:{zh_CN: '请输入主题模板!',en_US:"theme is required"}},
    BRAND_LOGO_URL:{zh_CN: 'Logo链接',en_US:"Logo url",require:{zh_CN: '请输入Logo链接!',en_US:"Logo url is required"}},
  },
  BrandSupplierLang:{
    undefined:"暂无信息"
  },
  SeriesLang:{
    SERIES_SEARCH:{zh_CN: '系列搜索',en_US:"series"},
    SERIES_NAME:{zh_CN: '系列名称',en_US:"series name",require:{zh_CN: '请输入系列名称!',en_US:"series name is required"}},
    SERIES_CODE:{zh_CN: '系列编码',en_US:"series code",require:{zh_CN: '请输入分类名称!',en_US:"series code is required"}},
    SERIES_SELECT_AREA:{zh_CN: '商品选择区域',en_US:"product selection area"},
    SERIES_SELECT_TIP:{zh_CN: '可选择多个商品，选择时请确保每个商品为同一品牌和分类，并注意个别属性是否必选！',en_US:"Here you can choose multiple products,and make sure that each product must be belong to the same brand and category ,and notice that it's attribute is required or not!"},
    SERIES_COVER_TIP:{zh_CN: '该商品已存在，是否覆盖？',en_US:"The product existed. Do you want to cover it?"},
    SERIES_SELECT_BRAND_FIRST_TIP:{zh_CN: '请先选择品牌!',en_US:"Please select the brand first!"},
    SERIES_SELECT_PRODUCT_TIP:{zh_CN: '请选择商品!',en_US:"Please select the product!"},
    SERIES_SELECT_ATTRIBUTE_REQUIRE_TIP:{zh_CN: '当属性为必填时，请务必勾选属性值！',en_US:"Please choose the attributes which are required!"},
  },
  CategoryAttributeLang:{
    CATEGORYATTRIBUTE_SEARCH:{zh_CN: '分类搜索',en_US:"category"},
    CATEGORYATTRIBUTE_NAME:{zh_CN: '分类名称',en_US:"category name",require:{zh_CN: '请输入分类名称!',en_US:"category name is required"}},
    CATEGORYATTRIBUTE_REQUIRE:{zh_CN: '是否必填',en_US:"required or not",require:{zh_CN: '请选择是否必填!',en_US:"requirement is required"}},
    CATEGORYATTRIBUTE_EDIT_MODE:{zh_CN: '编辑方式',en_US:"edit mode",require:{zh_CN: '请选择编辑方式!',en_US:"edit mode is required"}},
    CATEGORYATTRIBUTE_ATTRIBUTE_TYPE:{zh_CN: '属性类型',en_US:"attibute type",require:{zh_CN: '请选择属性类型!',en_US:"attibute type is required"}},
    CATEGORYATTRIBUTE_SELECT:{zh_CN: '分类',en_US:"category",require:{zh_CN: '请选择或分类范围!',en_US:"active category is required"}},
  },
  ValueLang:{
    VALUE_SEARCH:{zh_CN: '属性值搜索',en_US:"value"},
    VALUE_NAME:{zh_CN: '属性值名',en_US:"value name",require:{zh_CN: '请输入属性值名!',en_US:"value name is required"}},
    VALUE_SELECT:{zh_CN: '属性值',en_US:"value",require:{zh_CN: '请选择属性值!',en_US:"attribute value is required"}},
  },
  AttributeLang:{
    ATTRIBUTE_SEARCH:{zh_CN: '属性搜索',en_US:"attribute"},
    ATTRIBUTE_NAME:{zh_CN: '属性名称',en_US:"attribute name",require:{zh_CN: '请输入属性名称!',en_US:"attribute name is required"}},
    ATTRIBUTE_SELECT:{zh_CN: '属性',en_US:"attribute",require:{zh_CN: '请选择属性!',en_US:"attribute is required"}},
  },
  AttributeValueLang:{
    ATTRIBUTEVALUE_EXPAND:{zh_CN: '点击‘+’展开选择',en_US:"click '+' to select values"},
  },
  OrderLang:{
    ORDER_SEARCH:{zh_CN: '订单搜索',en_US:"order"},
    ORDER_NO:{zh_CN: '订单号',en_US:"order_no"},
    ORDER_TIME:{zh_CN: '下单时间',en_US:"order_time"},
    ORDER_USER:{zh_CN: '下单用户',en_US:"order_user"},
    ORDER_WAREHOUSE:{zh_CN: '发货仓库',en_US:"order_user"},
    ORDER_AMOUNT:{zh_CN: '商品总价',en_US:"amout"},
    ORDER_ACTIVITY_DISCOUNT:{zh_CN: '活动抵扣',en_US:"activity discount"},
    ORDER_COUPON_DISCOUNT:{zh_CN: '优惠券抵扣',en_US:"coupon discount"},
    ORDER_VIP_DISCOUNT:{zh_CN: '会员抵扣',en_US:"coupon discount"},
    ORDER_TOTAL_FREIGHT:{zh_CN: '总运费',en_US:"Total freight"},
    ORDER_FREIGHT_DISCOUNT:{zh_CN: '运费抵扣',en_US:"freight discount"},
    ORDER_TOTAL_TAX:{zh_CN: '总税费',en_US:"Total tax"},
    ORDER_TAX_DISCOUNT:{zh_CN: '税费抵扣',en_US:"tax discount"},
    ORDER_CLOSE_TYPE:{zh_CN: '原因类型',en_US:"type"},
    ORDER_CLOSE_PLACEHOLDER:{zh_CN: '原因类型为【其他】，则此处必填',en_US:"give the reason when choosing 【other】"},
    ORDER_CLOSE_TYPE_WARNNING:{zh_CN: '请选择【原因类型】!',en_US:"please choose the 【type of reason】!"},
    ORDER_CLOSE_REASON_WARNNING:{zh_CN: '原因类型为【其他】时，请填写具体内容!',en_US:"give the specific reason when choosing 【other】!"},
    ORDER_DEAL_WITH:{zh_CN: '订单处理',en_US:"deal with order"},
    ORDER_CLOSE_TIP_IN_NOTICE:{zh_CN: '请到订单界面处理！',en_US:"Please deal with it in the layout of order!"},
  },
  OrderServiceLang:{
    ORDERSERVICE_SEARCH:{zh_CN: '售后单搜索',en_US:"order"},
    ORDERSERVICE_NO:{zh_CN: '售后单号',en_US:"service_no"},
    ORDERSERVICE_PRODUCT_ID:{zh_CN: '商品ID',en_US:"product ID"},
    ORDERSERVICE_PRODUCT_NAME:{zh_CN: '商品名',en_US:"product name"},
    ORDERSERVICE_PRODUCT_ATTRIBUTE:{zh_CN: '商品属性',en_US:"product attr"},
    ORDERSERVICE_QUANTITY:{zh_CN: '数量',en_US:"quantity"},
    ORDERSERVICE_SERVICE_REASON:{zh_CN: '售后原因',en_US:"service reason"},
    ORDERSERVICE_SERVICE_REFER_DATE:{zh_CN: '发起日期',en_US:"refer_date"},
    ORDERSERVICE_CLOSE_REASON:{zh_CN: '关闭原因',en_US:"reasons for closure"},
    ORDERSERVICE_CLOSE_REASON_REQUIRE:{zh_CN: '请填写原因',en_US:"please give the reasons for closure"},
    ORDERSERVICE_REFUND_TYPE:{zh_CN: '退款类型',en_US:"refund type"},
    ORDERSERVICE_REFUND:{zh_CN: '退款金额',en_US:"refund"},
    ORDERSERVICE_REFUND_REQUIRE:{zh_CN: '退款类型必选，退款金额必填！',en_US:"the amount and type of refund are required!"},
  },
  CategoryLang:{
    CATEGORY_SEARCH:{zh_CN: '分类搜索',en_US:"category"},
    CATEGORY_NAME:{zh_CN: '分类名',en_US:"category name",require:{zh_CN: '请输入分类名!',en_US:"category name is required"}},
    CATEGORY_DEPTH:{zh_CN: '层级',en_US:"depth"},
    CATEGORY_NODE_PATH:{zh_CN: '分类路径',en_US:"node path"},
    CATEGORY_SELL_RATE:{zh_CN: '佣金比例',en_US:"sell rate"},
    CATEGORY_PRODUCT_PREFIX:{zh_CN: '货号前缀',en_US:"product prefix"},
  },
  UnitLang:{
    UNIT_SEARCH:{zh_CN: '单位搜索',en_US:"unit"},
    UNIT_SELECT:{zh_CN: '单位',en_US:"unit",require:{zh_CN: '请选择单位!',en_US:"unit is required"}},
    UNIT_NAME:{zh_CN: '单位名',en_US:"unit name",require:{zh_CN: '请输入单位名!',en_US:"unit name is required"}},
    UNIT_CODE:{zh_CN: '编码',en_US:"unit code",require:{zh_CN: '请输入单位编码!',en_US:"unit code is required"}},
  },
  UnitConvertLang:{
    UNITCONVERT_NAME_1:{zh_CN: '单位1名',en_US:"unit name 1",require:{zh_CN: '请输入单位1名!',en_US:"unit name 1 is required"}},
    UNITCONVERT_NAME_2:{zh_CN: '单位2名',en_US:"unit name 2",require:{zh_CN: '请输入单位2名!',en_US:"unit name 2 is required"}},
    UNITCONVERT_JOIN_TYPE:{zh_CN: '拼接',en_US:"join",require:{zh_CN: '请输入拼接字段',en_US:"join type is required"}},
    UNITCONVERT_VALUE:{zh_CN: '换算率',en_US:"conversion rate",require:{zh_CN: '请输入换算率!',en_US:"conversion rate is required"}},
  },
  RoleLang:{
    ROLE_SEARCH:{zh_CN: '角色搜索',en_US:"role"},
    ROLE_NAME:{zh_CN: '角色名',en_US:"role name",require:{zh_CN: '请输入角色名!',en_US:"role name is required"}},
    ROLE_SELECT:{zh_CN: '角色',en_US:"role",require:{zh_CN: '请选择角色!',en_US:"role is required"}},
  },
  ManagerLang:{
    MANAGER_SEARCH:{zh_CN: '账号搜索',en_US:"user name"},
    MANAGER_NAME:{zh_CN: '账号',en_US:"user name",require:{zh_CN: '请输入角色名!',en_US:"user name is required"}},
    MANAGER_ROLE_NAME:{zh_CN: '角色名',en_US:"role name",require:{zh_CN: '请输入角色名!',en_US:"role name is required"}},
    MANAGER_IS_ROOT:{zh_CN: '最高权限',en_US:"root",require:{zh_CN: '请选择最高权限!',en_US:"root is required"}},
  },
  ManagerLogLang:{
    MANAGERLOG_CONTENT:{zh_CN: '管理员操作内容',en_US:"operation details"},
    MANAGERLOG_LOG_DATE:{zh_CN: '日志时间',en_US:"root",require:{zh_CN: '请选择最高权限!',en_US:"root is required"}},
  },
  ShowNavLang:{
    SHOWNAV_CATEGORY:{zh_CN: '分类',en_US:"category"},
    SHOWNAV_JUMP_TO:{zh_CN: '跳转链接',en_US:"url",require:{zh_CN: '请输入跳转链接!',en_US:"url is required"}},
    SHOWNAV_PICTURE:{zh_CN: '广告图片',en_US:"ad pictur"},
  },
  ShowNavGroupLang:{
    SHOWNAVGROUP_SEARCH:{zh_CN: '分类显示组名',en_US:"name"},
    SHOWNAVGROUP_SELECT:{zh_CN: '分类显示组',en_US:"group of showing navs",require:{zh_CN: '请选择显示分类组!',en_US:"the group of showing navs is required"}},
    SHOWNAVGROUP_NAME:{zh_CN: '名称',en_US:"name",require:{zh_CN: '请输入显示分类组名称!',en_US:"the name of the group of showing navs is required"}},
  },
  ModuleLang:{
    MODULE_SEARCH:{zh_CN: '模板名',en_US:"module"},
    MODULE_NAME:{zh_CN: '模板名',en_US:"module",require:{zh_CN: '请输入模板名!',en_US:"module name is required"}},
    MODULE_SRC:{zh_CN: '示例图片',en_US:"sample picture"},
    MODULE_URL:{zh_CN: '文件链接',en_US:"file url",require:{zh_CN: '请输入文件链接地址!',en_US:"file url is required"}},
  },
}

export default LangConfig;




