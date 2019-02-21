import React, { Fragment } from 'react';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import { imgPrefix, adminName } from '@/defaultSettings';
import { Tag, Rate, Row, Col, Button, Menu, Modal, Dropdown, Icon, Card } from 'antd';
import ConditionQuery from '@/components/ConditionQuery';
import StandardTable from '@/components/StandardTable';
import LangConfig from '@/assets/LangConfig';
import AllCategory from '@/assets/allCategory.json';
import { ProductEnum, CommonEnum, SystemEnum, OrderEnum, MessageEnum, MarketEnum, UrlEnum } from '@/assets/Enum';
import { getLocale } from 'umi/locale';

// console.log("common",window.g_app._store.getState().common)

const lang = getLocale() === "zh-CN" ? "zh_CN" : "en_US";
const { WareType, EditMode, AttributeType, SaleStatus_POS, WareType_POS } = ProductEnum;
const { OwnerType, PlatType, Assort_POS, Action } = SystemEnum;
const { OrderStatus, OrderStatus_POS, ServiceStatus_POS, ServiceType } = OrderEnum;
const { LetterType } = MessageEnum;
const { CouponType, PromotionType } = MarketEnum;
const { Bool, Read, SortField, Act, PlatForm_Lock, Root, CheckStatus_POS, Show_POS, Top_POS, Act_POS, ActionStatus_POS, Root_POS } = CommonEnum;
const { LetterAPI, ReviewAPI, ManagerAPI, ProductAPI } = UrlEnum;
const {
  CommonLang: { NO_DESC, NO_PIC, DELIVERY_DATE, STATUS, CLOSE, NEW, EXPORT, BATCH_OPERATION, CONFIRM: confirmButtonName, CANCEL, IS_ENABLE, IS_UNDONO, IS_RECYCLE, SHOW_ALL, SHOW_AVAILABLE, SHOW_UNDONO, SHOW_RECYCLE, ACTION, TYPE, LOCK_BY_PLATFORM, SEQUENCE, INSERT_DATE, INSERT_CREATOR, TITLE, VALID_TIME, DESCRIPTION, USE, PHONE, EMAIL, OWNER_NAME, OWNER_ID, ADMIN, REMARK, OWNER_TYPE, IP },
  ReviewLang: { REVIEW_PRODUCT, REVIEW_LEVEL, REVIEW_COMMENT, REVIEW_PICTURE, REVIEW_IS_ADDITIONAL_COMMENT, REVIEW_ADDITIONAL_COMMENT, REVIEW_ADDITIONAL_PICTURE, REVIEW_ACCOUNT },
  LetterLang: { LETTER_SEARCH, LETTER_READ_DATE },
  PromotionLang: { PROMOTION_SEARCH, PROMOTION_NAME, },
  CountDownLang: { COUNTDOWN_SEARCH, COUNTDOWN_NAME, COUNTDOWN_LIMITED_PRICE },
  CouponLang: { COUPON_SEARCH, COUPON_NAME, COUPON_DISCOUNTS, COUPON_RECEPTION, COUPON_IS_OPEN, COUPON_IS_FIRST },
  GroupBuyLang: { GROUPBUY_SEARCH, GROUPBUY_NAME, GROUPBUY_PRICE, GROUPBUY_PARTICIPANTS, GROUPBUY_PERSONAL_RESTRICTION, GROUPBUY_QUANTITY },
  GroupLang: { GROUP_SEARCH, GROUP_NAME, GROUP_PRICE },
  ProductLang: { PRODUCT_SEARCH, PRODUCT_NAME, PRODUCT_CODE, PRODUCT_SPECIFICATION, PRODUCT_MODEL, PRODUCT_NET_WEIGHT, PRODUCT_SALE_PRICE, PRODUCT_COST_PRICE, PRODUCT_VIEWS, PRODUCT_SALE_COUNTS, PRODUCT_COMMENT_COUNTS, PRODUCT_DISCOUNT_SHARE, PRODUCT_SPECIAL_PRICE, PRODUCT_SALE_STATUS, PRODUCT_IS_EXCLUDE_ACTIVITY, PRODUCT_NO_RECORD },
  SeriesLang: { SERIES_SEARCH, SERIES_NAME, SERIES_CODE },
  CategoryAttributeLang: { CATEGORYATTRIBUTE_SEARCH, CATEGORYATTRIBUTE_NAME, CATEGORYATTRIBUTE_REQUIRE, CATEGORYATTRIBUTE_EDIT_MODE, CATEGORYATTRIBUTE_ATTRIBUTE_TYPE },
  ValueLang: { VALUE_SEARCH, VALUE_NAME },
  AttributeLang: { ATTRIBUTE_SEARCH, ATTRIBUTE_NAME },
  AttributeValueLang: { ATTRIBUTEVALUE_EXPAND },
  BrandLang: { BRAND_SEARCH, BRAND_NAME, BRAND_LOGO, BRAND_NAME_EN, BRAND_NAME_CN, BRAND_ALIAS, BRAND_COMPANY_URL },
  OrderLang: { ORDER_SEARCH, ORDER_NO, ORDER_TIME, ORDER_USER, ORDER_WAREHOUSE, ORDER_AMOUNT, ORDER_ACTIVITY_DISCOUNT, ORDER_COUPON_DISCOUNT, ORDER_VIP_DISCOUNT, ORDER_TOTAL_FREIGHT, ORDER_FREIGHT_DISCOUNT, ORDER_TOTAL_TAX, ORDER_TAX_DISCOUNT },
  OrderServiceLang: { ORDERSERVICE_SEARCH, ORDERSERVICE_NO, ORDERSERVICE_PRODUCT_ID, ORDERSERVICE_PRODUCT_NAME, ORDERSERVICE_PRODUCT_ATTRIBUTE, ORDERSERVICE_QUANTITY, ORDERSERVICE_SERVICE_REASON, ORDERSERVICE_SERVICE_REFER_DATE },
  WarehouseLang: { WAREHOUSE_SEARCH, WAREHOUSE_NAME },
  ExpressSupplierLang: { EXPRESSSUPPLIER_SEARCH, EXPRESSSUPPLIER_NAME, EXPRESSSUPPLIER_CODE_SEARCH, EXPRESSSUPPLIER_CODE },
  ExpressLang: { EXPRESS_SEARCH, EXPRESS_NAME, EXPRESS_CODE_SEARCH, EXPRESS_CODE },
  ShipTemplateLang: { SHIPTEMPLATE_SEARCH, SHIPTEMPLATE_NAME, SHIPTEMPLATE_INIT_WEIGHT_AND_PRICE, SHIPTEMPLATE_ADDITONAL_WEIGHT_AND_PRICE },
  ShipModeLang: { SHIPMODE_SEARCH, SHIPMODE_NAME, SHIPMODE_PRIVATE_NAME, SHIPMODE_EXPRESS, SHIPMODE_TEMPLATE, SHIPMODE_OPETATE_COSE },
  RoleLang: { ROLE_NAME, ROLE_SEARCH },
  ManagerLang: { MANAGER_SEARCH, MANAGER_NAME, MANAGER_ROLE_NAME, MANAGER_IS_ROOT },
  ManagerLogLang: { MANAGERLOG_CONTENT, MANAGERLOG_LOG_DATE },
  CategoryLang: { CATEGORY_SEARCH, CATEGORY_NAME, CATEGORY_NODE_PATH, CATEGORY_DEPTH, CATEGORY_PRODUCT_PREFIX, CATEGORY_SELL_RATE },
  UnitLang: { UNIT_SEARCH, UNIT_NAME, UNIT_CODE },
  UnitConvertLang: { UNITCONVERT_NAME_1, UNITCONVERT_NAME_2, UNITCONVERT_VALUE, UNITCONVERT_JOIN_TYPE },
  ShowNavLang:{SHOWNAV_CATEGORY,SHOWNAV_JUMP_TO},
  ModuleLang:{MODULE_SEARCH,MODULE_NAME,MODULE_SRC},
} = LangConfig;

const isWaitDeal = { fieldId: 'is_wait_deal', label: IS_UNDONO[lang], fieldType: 'select', fieldProps: { options: [{ label: SHOW_ALL[lang], value: 0 }, { label: SHOW_UNDONO[lang], value: 1 }] }, colLayout: { span: 8 } };
const isRecycle = { fieldId: 'is_recycle', label: IS_RECYCLE[lang], fieldType: 'select', fieldProps: { options: [{ label: SHOW_ALL[lang], value: 0 }, { label: SHOW_RECYCLE[lang], value: 1 }] }, colLayout: { span: 8 } };
const isEnable = { fieldId: 'is_enable', label: IS_ENABLE[lang], fieldType: 'select', fieldProps: { options: [{ label: SHOW_ALL[lang], value: 0 }, { label: SHOW_AVAILABLE[lang], value: 1 }] }, colLayout: { span: 8 } };


const commonMarketingColumns = [
  // {
  //   title: USE[lang], dataIndex: 'is_act',  width: 100, render: (is_act, item) => {
  //     let couponStatus = "已过期";
  //     let color = "gray";
  //     if (new Date(item.end_date).getTime() > new Date().getTime()) {
  //       couponStatus = is_act ? ActionStatus_POS.ACT[lang] : "已停用";
  //       color = is_act ? "green" : "red";
  //     }
  //     return <Tag color={color}>{couponStatus}</Tag>;
  //   }
  // },
  { title: VALID_TIME[lang], dataIndex: 'start_date', width: 200, render: (start_date, item) => <span>{start_date}<br />{item.end_date}</span> },
  { title: DESCRIPTION[lang], dataIndex: 'description', width: 200, render: (description) => <span>{description || NO_DESC[lang]}</span> },
];

const TableConfig = {
  ProductTable: {
    CONDITION: [
      { fieldId: 'product', label: PRODUCT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'sale_status', label: PRODUCT_SALE_STATUS[lang], fieldType: 'select', fieldProps: { options: Object.values(SaleStatus_POS).filter(i => i.code !== 1).map(i => ({ label: i[lang], value: i.code })) }, colLayout: { span: 8 } },
      { fieldId: 'is_exclude_activity', label: PRODUCT_IS_EXCLUDE_ACTIVITY[lang], fieldType: 'select', fieldProps: { options: [{ label: SHOW_ALL[lang], value: 0 }, { label: PRODUCT_IS_EXCLUDE_ACTIVITY[lang], value: 1 }] }, colLayout: { span: 8 } },
      isEnable,
      (adminName.code === 1 || adminName.code === 2) && isWaitDeal,
      (adminName.code === 1 || adminName.code === 2) && isRecycle
    ],
    COLUMNS: [
      { title: '', dataIndex: 'image_url', width: 100, fixed: "left", render: (url) => <img src={`${imgPrefix}/${url}`} height="60px" width="60px" alt="" /> },
      { title: PRODUCT_NAME[lang], dataIndex: 'name', sorter: true, width: 200, fixed: "left" },
      { title: BRAND_NAME[lang], dataIndex: 'brand', width: 100, render: (brand) => <span>{brand && brand.name}</span> },
      { title: PRODUCT_CODE[lang], dataIndex: 'code', width: 100 },
      { title: PRODUCT_SPECIFICATION[lang], dataIndex: 'specification', width: 200 },
      { title: PRODUCT_MODEL[lang], dataIndex: 'model', width: 100 },
      { title: PRODUCT_NET_WEIGHT[lang], dataIndex: 'net_weight', width: 100 },
      { title: PRODUCT_SALE_PRICE[lang], dataIndex: 'sale_price', sorter: true, width: 150 },
      { title: PRODUCT_COST_PRICE[lang], dataIndex: 'cost_price', width: 150 },
      { title: WAREHOUSE_NAME[lang], dataIndex: 'ware_type', width: 100, render: (ware_type) => <span>{WareType[ware_type][lang]}</span> },
      { title: PRODUCT_DISCOUNT_SHARE[lang], dataIndex: 'is_not_promotion', width: 100, render: (is_not_promotion) => <Tag color="blue">{Bool[is_not_promotion][lang]}</Tag> },
      { title: PRODUCT_VIEWS[lang], dataIndex: 'visti_counts', sorter: true, width: 100 },
      { title: PRODUCT_SALE_COUNTS[lang], dataIndex: 'sale_counts', sorter: true, width: 100 },
      { title: PRODUCT_COMMENT_COUNTS[lang], dataIndex: 'comment_counts', width: 100 },
      { title: INSERT_DATE[lang], dataIndex: 'builder_date', width: 200 },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: 200, render: (_, item) => <Tag color="blue">{TableConfig.ProductTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    COLUMNS_MINI: [
      { title: '', dataIndex: 'image_url', width: '10%', render: (url) => <img src={`${imgPrefix}/${url}`} height="60px" width="60px" alt={NO_PIC[lang]} /> },
      { title: PRODUCT_NAME[lang], dataIndex: 'name', width: '15%' },
      { title: BRAND_NAME[lang], dataIndex: 'brand', width: '10%', render: (brand) => <span>{brand && brand.name}</span> },
      { title: PRODUCT_MODEL[lang], dataIndex: 'model', width: '10%' },
      { title: PRODUCT_SPECIFICATION[lang], dataIndex: 'specification', width: '20%' },
      { title: PRODUCT_SALE_PRICE[lang], dataIndex: 'sale_price', width: '10%' },
      { title: PRODUCT_COST_PRICE[lang], dataIndex: 'cost_price', width: '10%' },
      { title: PRODUCT_CODE[lang], dataIndex: 'code', width: '15%' },
    ],
    ACTION_COLUMN_CONFIG: { width: 200, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, DELETE, LOCK, UNLOCK, CHECKUNPASS, CHECKPASS, RECORD, RE_RECORD, REVERT, REMOVE, SALEON, SALEOFF } = api;
      const { is_del, is_lock, s_is_del, s_is_lock, sale_status } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${is_del}${is_lock}${s_is_del}${s_is_lock}${sale_status}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("00002") === 0) {
          actionBtn = [CHECKPASS, CHECKUNPASS, LOCK];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("00003") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
        if (statusStr.indexOf("00004") === 0) {
          if (Bool[item.is_plat_record].flag && [WareType_POS.DIRECT_MAIL_WAREHOUSE.code, WareType_POS.BONDED_WAREHOUSE.code].includes(item.ware_type)) {
            actionBtn = [RECORD, LOCK];
            statusName = ActionStatus_POS.RECORD_WAIT[lang];
          } else {
            actionBtn = [LOCK];
            statusName = PRODUCT_NO_RECORD[lang];
          }
        }
        if (statusStr.indexOf("00005") === 0) {
          if (Bool[item.is_plat_record].flag && [WareType_POS.DIRECT_MAIL_WAREHOUSE.code, WareType_POS.BONDED_WAREHOUSE.code].includes(item.ware_type)) {
            actionBtn = [RE_RECORD, LOCK];
            statusName = ActionStatus_POS.RECORD_FAIL[lang];
          } else {
            actionBtn = [LOCK];
            statusName = PRODUCT_NO_RECORD[lang];
          }
        }
        if (statusStr.indexOf("00006") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PUT_WAIT[lang];
        }
        if (statusStr.indexOf("00007") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PUT_ON[lang];
        }
        if (statusStr.indexOf("00008") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PUT_DOWN[lang];
        }
      } else if (adminName.code === 2) {
        if (statusStr.indexOf("1") === 0) {
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [REMOVE, REVERT];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("00001") === 0) {
          actionBtn = [FORM];
          statusName = ActionStatus_POS.DRAFT[lang];
        }
        if (statusStr.indexOf("00002") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.RECORD_WAIT[lang];
        }
        if (statusStr.indexOf("00003") === 0) {
          actionBtn = [LOCK, FORM];
          statusName = ActionStatus_POS.RECORD_FAIL[lang];
        }
        if (statusStr.indexOf("00004") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.RECORD_WAIT[lang];
        }
        if (statusStr.indexOf("00005") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.RECORD_FAIL[lang];
        }
        if (statusStr.indexOf("00006") === 0) {
          actionBtn = [LOCK, SALEON];
          statusName = ActionStatus_POS.PUT_WAIT[lang];
        }
        if (statusStr.indexOf("00007") === 0) {
          actionBtn = [SALEOFF];
          statusName = ActionStatus_POS.PUT_ON[lang];
        }
        if (statusStr.indexOf("00008") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PUT_DOWN[lang];
        }
      } else {
        statusName = ActionStatus_POS.PUT_ON[lang];
      }
      return { statusName, actionBtn };
    }
  },
  SeriesTable: {
    CONDITION: [
      { fieldId: 'series', label: SERIES_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'product', label: PRODUCT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: SERIES_NAME[lang], dataIndex: 'name', width: "20%" },
      { title: SERIES_CODE[lang], dataIndex: 'code', width: "20%" },
      { title: BRAND_NAME[lang], dataIndex: 'brand', width: "10%" },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: "10%" },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: "10%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.SeriesTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "20%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, CHECKPASS, CHECKUNPASS, DELETE, REMOVE, REVERT } = api;
      const { s_is_del, s_is_lock, is_lock, check_status } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${s_is_del}${s_is_lock}${is_lock}${check_status}`;
      if (adminName.code === 1) {
        if (statusStr.charAt(2) === "1") {
          actionBtn = [UNLOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [LOCK, CHECKPASS, CHECKUNPASS];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
        if (statusStr.indexOf("0002") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
      } else {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
        if (statusStr.indexOf("0002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  CategoryAttributeTable: {
    CONDITION: [
      { fieldId: 'category', label: CATEGORYATTRIBUTE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: CATEGORYATTRIBUTE_NAME[lang], dataIndex: 'name', width: 200, fixed: "left" },
      { title: CATEGORYATTRIBUTE_REQUIRE[lang], dataIndex: 'is_required', width: 150, render: (is_required) => <Tag color="blue">{Bool[is_required][lang]}</Tag> },
      { title: CATEGORYATTRIBUTE_EDIT_MODE[lang], dataIndex: 'edit_mode', width: 100, render: (edit_mode) => <Tag color="blue">{EditMode[edit_mode][lang]}</Tag> },
      { title: CATEGORYATTRIBUTE_ATTRIBUTE_TYPE[lang], dataIndex: 'attribute_type', width: 100, render: (attribute_type) => <Tag color="blue">{AttributeType[attribute_type][lang]}</Tag> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: 100 },
      { title: OWNER_TYPE[lang], dataIndex: 'owner_type', width: 150, render: (owner_type) => <span>{OwnerType[owner_type][lang]}</span> },
      { title: INSERT_DATE[lang], dataIndex: 'ins_date', sorter: true, width: 200 },
      { title: INSERT_CREATOR[lang], dataIndex: 'ins_user', width: 150 },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: 100, render: (_, item) => <Tag color="blue">{TableConfig.CategoryAttributeTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    ACTION_COLUMN_CONFIG: { width: 200, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, REMOVE } = api;
      const { is_lock, s_is_lock } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${s_is_lock}${is_lock}`;
      if (adminName.code === 1) {
        if (statusStr.charAt(1) === "1") {
          actionBtn = [UNLOCK, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("10") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("00") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      } else {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [UNLOCK, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("00") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  ValueTable: {
    CONDITION: [
      { fieldId: 'value', label: VALUE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'attribute', label: ATTRIBUTE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },

    ],
    COLUMNS: [
      { title: ATTRIBUTE_NAME[lang], dataIndex: 'name', width: '40%', sorter: true },
      { title: SEQUENCE[lang], dataIndex: 'sequence', sorter: true, width: "10%" },
      { title: INSERT_DATE[lang], dataIndex: 'ins_date', width: "30%" },
      { title: INSERT_CREATOR[lang], dataIndex: 'ins_user', width: "20%" },
    ],
    COLUMNS_REST: [
      { title: VALUE_NAME[lang], dataIndex: 'name', width: '25%', sorter: true },
      { title: SEQUENCE[lang], dataIndex: 'sequence', sorter: true, width: "15%" },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: "15%" },
      { title: OWNER_TYPE[lang], dataIndex: 'owner_type', width: "15%", render: (owner_type) => <span>{OwnerType[owner_type][lang]}</span> },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "15%", render: (_, item) => <Tag color="blue">{TableConfig.ValueTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "40%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, REMOVE } = api;
      const { is_lock, s_is_lock } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${s_is_lock}${is_lock}`;
      if (adminName.code === 1) {
        if (statusStr.charAt(1) === "1") {
          actionBtn = [UNLOCK, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("10") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("00") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      } else {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [UNLOCK, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("00") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  AttributeTable: {
    CONDITION: [
      { fieldId: 'attribute', label: ATTRIBUTE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: ATTRIBUTE_NAME[lang], dataIndex: 'name', width: "15%", sorter: true },
      { title: OWNER_TYPE[lang], dataIndex: 'owner_type', width: "10%", render: (owner_type) => <span>{OwnerType[owner_type][lang]}</span> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: "10%" },
      { title: INSERT_CREATOR[lang], dataIndex: 'ins_user', width: "10%" },
      { title: INSERT_DATE[lang], dataIndex: 'ins_date', width: "20%" },
      { title: SEQUENCE[lang], dataIndex: 'sequence', sorter: true, width: "10%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.AttributeTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "20%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, REMOVE } = api;
      const { is_lock, s_is_lock } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${s_is_lock}${is_lock}`;
      if (adminName.code === 1) {
        if (statusStr.charAt(1) === "1") {
          actionBtn = [UNLOCK, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("10") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("00") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      } else {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [UNLOCK, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("00") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  AttributeValueTable: {
    CONDITION: [
      { fieldId: 'attribute', label: ATTRIBUTE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: ATTRIBUTE_NAME[lang], dataIndex: 'attribute', width: "15%", render: (val) => <span>{val.name}</span> },
      { title: VALUE_NAME[lang], dataIndex: 'name', width: '15%', render: (val) => <span style={{ color: "green" }}>{val || ATTRIBUTEVALUE_EXPAND[lang]}</span> },
      { title: CATEGORYATTRIBUTE_REQUIRE[lang], dataIndex: 'is_required', width: 150, render: (is_required) => <Tag color="blue">{Bool[is_required][lang]}</Tag> },
      { title: CATEGORYATTRIBUTE_EDIT_MODE[lang], dataIndex: 'edit_mode', width: 100, render: (edit_mode) => <Tag color="blue">{EditMode[edit_mode][lang]}</Tag> },
      { title: CATEGORYATTRIBUTE_ATTRIBUTE_TYPE[lang], dataIndex: 'attribute_type', width: 100, render: (attribute_type) => <Tag color="blue">{AttributeType[attribute_type][lang]}</Tag> },
      { title: OWNER_TYPE[lang], dataIndex: 'owner_type', width: 150, render: (owner_type) => <span>{OwnerType[owner_type][lang]}</span> },
    ],
    COLUMNS_REST: [
      { title: VALUE_NAME[lang], dataIndex: 'name', width: '50%' },
      { title: CATEGORYATTRIBUTE_EDIT_MODE[lang], dataIndex: 'edit_mode', width: '20%', render: (edit_mode) => <Tag color="blue">{EditMode[edit_mode][lang]}</Tag> },
      // { title: CATEGORYATTRIBUTE_REQUIRE[lang], dataIndex: 'is_required',  width: 150, render: (is_required) => <Tag color="blue">{Bool[is_required][lang]}</Tag> },
      // { title: CATEGORYATTRIBUTE_EDIT_MODE[lang], dataIndex: 'edit_mode',  width: 100, render: (edit_mode) => <Tag color="blue">{EditMode[edit_mode][lang]}</Tag> },
      // { title: CATEGORYATTRIBUTE_ATTRIBUTE_TYPE[lang], dataIndex: 'attribute_type',  width: 100, render: (attribute_type) => <Tag color="blue">{AttributeType[attribute_type][lang]}</Tag> },
      // { title: OWNER_TYPE[lang], dataIndex: 'owner_type',  width: 150, render: (owner_type) => <span>{OwnerType[owner_type][lang]}</span> },
    ]
  },
  BrandTable: {
    CONDITION: [
      { fieldId: 'brand', label: BRAND_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      isEnable,
      adminName.code === 1 && isRecycle
    ],
    COLUMNS: [
      { title: BRAND_LOGO[lang], dataIndex: 'logo', width: "10%", render: val => <img style={{ width: 64, cursor: 'pointer' }} src={`${imgPrefix}${val}`} alt={NO_PIC[lang]} /> },
      { title: BRAND_NAME_CN[lang], dataIndex: 'name', width: "15", sorter: true },
      { title: BRAND_NAME_EN[lang], dataIndex: 'name_en', width: "15%" },
      { title: BRAND_ALIAS[lang], dataIndex: 'name_by', width: "10%" },
      { title: BRAND_COMPANY_URL[lang], dataIndex: 'company_url', width: "10%" },
      { title: SEQUENCE[lang], dataIndex: 'sequence', width: "10%", sorter: true },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.BrandTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "20%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, REMOVE, REVERT } = api;
      const { is_del, is_lock } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${is_del}${is_lock}`;
      if (statusStr.indexOf("1") === 0) {
        actionBtn = [REVERT, REMOVE];
        statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
      }
      if (statusStr.indexOf("01") === 0) {
        actionBtn = [UNLOCK, DELETE];
        statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
      }
      if (statusStr.indexOf("00") === 0) {
        actionBtn = [FORM, LOCK];
        statusName = ActionStatus_POS.ENABLE[lang];
      }
      return { statusName, actionBtn };
    }
  },
  BrandSupplierTable: {
    CONDITION: [
      { fieldId: 'brand', label: BRAND_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      adminName.code === 1 && isWaitDeal,
      adminName.code === 2 && isEnable
    ],
    COLUMNS: [
      { title: BRAND_LOGO[lang], dataIndex: 'logo', width: "10%", render: (_, item) => <img style={{ width: 64, cursor: 'pointer' }} src={`${imgPrefix}${item && item.brand.logo}`} alt={NO_PIC[lang]} /> },
      { title: BRAND_NAME_CN[lang], dataIndex: 'name', width: "15%", sorter: true, render: (_, item) => <span>{item && item.brand.name}</span> },
      { title: BRAND_NAME_EN[lang], dataIndex: 'name_en', width: "15%", render: (_, item) => <span>{item && item.brand.name_en}</span> },
      { title: BRAND_ALIAS[lang], dataIndex: 'name_by', width: "10%", render: (_, item) => <span>{item && item.brand.name_by}</span> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: "10%" },
      { title: SEQUENCE[lang], dataIndex: 'sequence', width: "10%", sorter: true, render: (_, item) => <span>{item && item.brand.sequence}</span> },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.BrandSupplierTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "20%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { LOCK, UNLOCK, CHECKPASS, CHECKUNPASS, REMOVE } = api;
      const { is_lock, s_is_lock, check_status } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${is_lock}${s_is_lock}${check_status}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [UNLOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("000") === 0) {
          actionBtn = [LOCK, CHECKPASS, CHECKUNPASS];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
        if (statusStr.indexOf("002") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
      } else {
        if (statusStr.charAt(1) === "1") {
          actionBtn = [UNLOCK, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("10") === 0) {
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("000") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
        if (statusStr.indexOf("002") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  CategoryTable: {
    CONDITION: [
      { fieldId: 'category', label: CATEGORY_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: CATEGORY_NAME[lang], dataIndex: 'name', width: "20%" },
      { title: CATEGORY_SELL_RATE[lang], dataIndex: 'sell_rate', width: "10%" },
      { title: CATEGORY_DEPTH[lang], dataIndex: 'depth', width: "10%" },
      { title: CATEGORY_NODE_PATH[lang], dataIndex: 'node_path', width: "15%" },
      { title: LOCK_BY_PLATFORM[lang], dataIndex: 'is_lock', width: "15%", render: (val) => <Tag color="blue">{PlatForm_Lock[val][lang]}</Tag> },
      { title: SEQUENCE[lang], dataIndex: 'sequence', width: "10%" },
      { title: CATEGORY_PRODUCT_PREFIX[lang], dataIndex: 'product_prefix', width: "20%" },
    ],
  },
  UnitTable: {
    CONDITION: [
      { fieldId: 'unit', label: UNIT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: UNIT_NAME[lang], dataIndex: 'name', width: "25%" },
      { title: UNIT_CODE[lang], dataIndex: 'code', width: "25%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "25%", render: (_, item) => <Tag color="blue">{TableConfig.UnitTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "40%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, REMOVE, REVERT } = api;
      const { is_del, is_lock } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${is_del}${is_lock}`;
      if (statusStr.indexOf("1") === 0) {
        actionBtn = [REVERT, REMOVE];
        statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
      }
      if (statusStr.indexOf("01") === 0) {
        actionBtn = [UNLOCK, DELETE];
        statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
      }
      if (statusStr.indexOf("00") === 0) {
        actionBtn = [FORM, LOCK];
        statusName = ActionStatus_POS.ENABLE[lang];
      }
      return { statusName, actionBtn };
    }
  },
  UnitConvertTable: {
    CONDITION: [
      { fieldId: 'unit', label: UNIT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: UNITCONVERT_NAME_1[lang], dataIndex: 'unit1_name', width: "15%" },
      { title: UNITCONVERT_NAME_2[lang], dataIndex: 'unit2_name', width: "15%" },
      { title: UNITCONVERT_VALUE[lang], dataIndex: 'convert_value', width: "15%" },
      { title: UNITCONVERT_JOIN_TYPE[lang], dataIndex: 'name', width: "15%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.UnitConvertTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "30%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, REMOVE } = api;
      const actionBtn = [FORM, REMOVE];
      const statusName = ActionStatus_POS.ENABLE[lang];
      return { statusName, actionBtn };
    }
  },
  WarehouseTable: {
    CONDITION: [
      { fieldId: 'warehouse', label: WAREHOUSE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: WAREHOUSE_NAME[lang], dataIndex: 'name', sorter: true, width: "20%" },
      { title: TYPE[lang], dataIndex: 'warehouse_type', width: "10%", render: (warehouse_type) => <span>{WareType[warehouse_type][lang]}</span> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: "10%" },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: "10%" },
      { title: OWNER_TYPE[lang], dataIndex: 'owner_type', width: "10%", render: (owner_type) => <span>{OwnerType[owner_type][lang]}</span> },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.WarehouseTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "30%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, CHECKPASS, CHECKUNPASS, DELETE, REMOVE, REVERT } = api;
      const { is_del, is_lock, s_is_del, s_is_lock, check_status } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_del}${is_lock}${s_is_del}${s_is_lock}${check_status}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("00000") === 0) {
          actionBtn = [FORM, CHECKPASS, CHECKUNPASS, LOCK];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("00001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
        if (statusStr.indexOf("00002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_del}${is_lock}${check_status}`
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("00000") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("00001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
        if (statusStr.indexOf("00002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  ExpressSupplierTable: {
    CONDITION: [
      { fieldId: 'express', label: EXPRESSSUPPLIER_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'code', label: EXPRESSSUPPLIER_CODE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: EXPRESSSUPPLIER_NAME[lang], dataIndex: 'name', sorter: true, width: "20%", render: (_, item) => <span>{item && item.express.name}</span> },
      { title: EXPRESSSUPPLIER_CODE[lang], dataIndex: 'code', width: "20%", render: (_, item) => <span>{item && item.express.code}</span> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: "10%" },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: "20%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.ExpressSupplierTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "20%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { LOCK, UNLOCK, CHECKPASS, CHECKUNPASS, REMOVE } = api;
      const { is_lock, s_is_lock, check_status } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${is_lock}${s_is_lock}${check_status}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [UNLOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("000") === 0) {
          actionBtn = [LOCK, CHECKPASS, CHECKUNPASS];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
        if (statusStr.indexOf("002") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
      } else {
        if (statusStr.charAt(1) === "1") {
          actionBtn = [UNLOCK, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("10") === 0) {
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("000") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
        if (statusStr.indexOf("002") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  ExpressTable: {
    CONDITION: [
      { fieldId: 'express', label: EXPRESS_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'code', label: EXPRESS_CODE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: EXPRESS_NAME[lang], dataIndex: 'name', sorter: true, width: "20%" },
      { title: EXPRESS_CODE[lang], dataIndex: 'code', width: "20%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.ExpressTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "50%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, REMOVE, REVERT } = api;
      const { is_del, is_lock } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${is_del}${is_lock}`;
      if (statusStr.indexOf("1") === 0) {
        actionBtn = [REVERT, REMOVE];
        statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
      }
      if (statusStr.indexOf("01") === 0) {
        actionBtn = [UNLOCK, DELETE];
        statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
      }
      if (statusStr.indexOf("00") === 0) {
        actionBtn = [FORM, LOCK];
        statusName = ActionStatus_POS.ENABLE[lang];
      }
      return { statusName, actionBtn };
    }
  },
  ShipTemplateTable: {
    CONDITION: [
      { fieldId: 'template', label: SHIPTEMPLATE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: SHIPTEMPLATE_NAME[lang], dataIndex: 'name', sorter: true, width: "20%", },
      { title: SHIPTEMPLATE_INIT_WEIGHT_AND_PRICE[lang], dataIndex: 'weight', width: "10%", render: (weight, item) => <span>{weight}kg/<span style={{ color: "red" }}>￥{item.price}</span></span> },
      { title: SHIPTEMPLATE_ADDITONAL_WEIGHT_AND_PRICE[lang], dataIndex: 'add_weight', width: "10%", render: (add_weight, item) => <span>{add_weight}kg/<span style={{ color: "red" }}>￥{item.price}</span></span> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: "10%" },
      { title: OWNER_TYPE[lang], dataIndex: 'owner_type', width: "10%", render: (owner_type) => <span>{OwnerType[owner_type][lang]}</span> },
      { title: SEQUENCE[lang], dataIndex: 'sequence', sorter: true, width: "10%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.ShipTemplateTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "20%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, REMOVE, REVERT } = api;
      const { is_del, is_lock, s_is_del, s_is_lock } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_del}${is_lock}${s_is_del}${s_is_lock}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_del}${is_lock}`;
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  ShipModeTable: {
    CONDITION: [
      { fieldId: 'mode', label: SHIPMODE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: SHIPMODE_NAME[lang], dataIndex: 'name', sorter: true, width: 100 },
      { title: SHIPMODE_PRIVATE_NAME[lang], dataIndex: 'show_name', width: 100 },
      { title: SHIPMODE_EXPRESS[lang], dataIndex: 'express_name', width: 100 },
      { title: SHIPMODE_TEMPLATE[lang], dataIndex: 'template_name', width: 100 },
      { title: SHIPMODE_OPETATE_COSE[lang], dataIndex: 'operate_cost', width: 100, render: (perate_cost) => <span>{perate_cost}元</span> },
      { title: SEQUENCE[lang], dataIndex: 'sequence', sorter: true, width: 100 },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: 100 },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: 100 },
      { title: OWNER_TYPE[lang], dataIndex: 'owner_type', width: 100, render: (owner_type) => <span>{OwnerType[owner_type][lang]}</span> },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: 100, render: (_, item) => <Tag color="blue">{TableConfig.ShipModeTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    ACTION_COLUMN_CONFIG: { width: 200, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, REMOVE, REVERT } = api;
      const { is_del, is_lock, s_is_del, s_is_lock } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_del}${is_lock}${s_is_del}${s_is_lock}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_del}${is_lock}`;
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  OrderTable: {
    CONDITION: [
      { fieldId: 'order', label: ORDER_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'product', label: PRODUCT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: ORDER_NO[lang], dataIndex: 'order_no', width: 280, fixed: "left", render: (order_no, item) => <span><Tag color="blue">{OrderStatus[item.order_status][lang]}</Tag>{order_no}</span> },
      { title: ORDER_TIME[lang], dataIndex: 'add_date', width: 200, sorter: true },
      { title: ORDER_USER[lang], dataIndex: 'user_name', width: 100 },
      { title: ORDER_WAREHOUSE[lang], dataIndex: 'warehouse_name', width: 150 },
      { title: ORDER_AMOUNT[lang], dataIndex: 'amount', width: 100, render: (amount) => <span>{amount}元</span> },
      { title: ORDER_ACTIVITY_DISCOUNT[lang], dataIndex: 'activity_dcnt', width: 100, render: (activity_dcnt) => <span>{activity_dcnt}元</span> },
      { title: ORDER_COUPON_DISCOUNT[lang], dataIndex: 'coupon_dcnt', width: 100, render: (coupon_dcnt) => <span>{coupon_dcnt}元</span> },
      { title: ORDER_VIP_DISCOUNT[lang], dataIndex: 'member_dcnt', width: 100, render: (member_dcnt) => <span>{member_dcnt}元</span> },
      { title: ORDER_TOTAL_FREIGHT[lang], dataIndex: 'freight', width: 100, render: (freight) => <span>{freight}元</span> },
      { title: ORDER_FREIGHT_DISCOUNT[lang], dataIndex: 'freight_dcnt', width: 100, render: (freight_dcnt) => <span>{freight_dcnt}元</span> },
      { title: ORDER_TOTAL_TAX[lang], dataIndex: 'tax', width: 100, render: (tax) => <span>{tax}元</span> },
      { title: ORDER_TAX_DISCOUNT[lang], dataIndex: 'tax_dcnt', width: 100, render: (tax_dcnt) => <span>{tax_dcnt}元</span> },
    ],
    ACTION_COLUMN_CONFIG: { width: 200, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { DELETE, REMOVE, REVERT, SEND: s, CLOSE: c } = api;
      const { is_del, s_is_del, order_status } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${is_del}${s_is_del}${order_status}`;
      // 对于销售商，状态与平台保持一致，但是没有action
      if (adminName.code === 1 || adminName.code === 3) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [DELETE];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [c];// 暂时没有报关api
          statusName = OrderStatus_POS.WAIT_RECORD[lang];
        }
        if (statusStr.indexOf("002") === 0) {
          actionBtn = [c];
          statusName = OrderStatus_POS.WAIT_SEND[lang];
        }
        if (statusStr.indexOf("003") === 0) {
          actionBtn = [c];
          statusName = OrderStatus_POS.WAIT_RECEIVE[lang];
        }
        if (statusStr.indexOf("004") === 0) {
          statusName = OrderStatus_POS.SUCCESS[lang];
        }
        if (statusStr.indexOf("005") === 0) {
          actionBtn = [DELETE];
          statusName = OrderStatus_POS.CLOSE[lang];
        }
        if (statusStr.indexOf("006") === 0) {
          statusName = OrderStatus_POS.ERROR[lang];
        }
      } else {
        if (statusStr.charAt(1) === "1") {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("10") === 0) {
          actionBtn = [DELETE];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [c];// 暂时没有报关api
          statusName = OrderStatus_POS.WAIT_RECORD[lang];
        }
        if (statusStr.indexOf("002") === 0) {
          actionBtn = [c, s];
          statusName = OrderStatus_POS.WAIT_SEND[lang];
        }
        if (statusStr.indexOf("003") === 0) {
          actionBtn = [c];
          statusName = OrderStatus_POS.WAIT_RECEIVE[lang];
        }
        if (statusStr.indexOf("004") === 0) {
          statusName = OrderStatus_POS.SUCCESS[lang];
        }
        if (statusStr.indexOf("005") === 0) {
          actionBtn = [DELETE];
          statusName = OrderStatus_POS.CLOSE[lang];
        }
        if (statusStr.indexOf("006") === 0) {
          statusName = OrderStatus_POS.ERROR[lang];
        }
      }
      if (adminName.code === 3) actionBtn = [];
      return { statusName, actionBtn };
    }
  },
  OrderServiceTable: {
    CONDITION: [
      { fieldId: 'service_no', label: ORDERSERVICE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'product', label: PRODUCT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: ORDERSERVICE_NO[lang], dataIndex: 'service_no', width: 200, fixed: "left", render: (val, item) => <span><Tag color="blue">{ServiceType[item.service_type][lang]}</Tag>{val}</span> },
      { title: ORDERSERVICE_PRODUCT_ID[lang], dataIndex: 'product_id', width: 100 },
      { title: ORDERSERVICE_PRODUCT_NAME[lang], dataIndex: 'product_name', width: 200 },
      { title: ORDERSERVICE_PRODUCT_ATTRIBUTE[lang], dataIndex: 'product_attr', width: 250 },
      { title: ORDERSERVICE_QUANTITY[lang], dataIndex: 'quantity', width: 100 },
      { title: ORDERSERVICE_SERVICE_REASON[lang], dataIndex: 'service_reason', width: 200 },
      { title: ORDERSERVICE_SERVICE_REFER_DATE[lang], dataIndex: 'refer_date', width: 200 },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: 200, render: (_, item) => <Tag color="blue">{TableConfig.OrderServiceTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    ACTION_COLUMN_CONFIG: { width: 100, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { CONFIRM, COMPLETE, CLOSE: closeAPI } = api;
      const { service_status } = item;
      let actionBtn = [];
      let statusName = "";
      if (service_status === ServiceStatus_POS.APPLY.code) {
        actionBtn = [CONFIRM];
        statusName = ServiceStatus_POS.APPLY[lang];
      } else if (service_status === ServiceStatus_POS.CONFIRM.code) {
        actionBtn = [COMPLETE, closeAPI];
        statusName = ServiceStatus_POS.CONFIRM[lang];
      } else if (service_status === ServiceStatus_POS.SOLVE.code) {
        actionBtn = [CLOSE];
        statusName = ServiceStatus_POS.SOLVE[lang];
      } else if (service_status === ServiceStatus_POS.COMPLETE.code) {
        statusName = ServiceStatus_POS.COMPLETE[lang];
      } else if (service_status === ServiceStatus_POS.CLOSE.code) {
        statusName = ServiceStatus_POS.CLOSE[lang];
      } else if (service_status === ServiceStatus_POS.CANCEL.code) {
        statusName = ServiceStatus_POS.CANCEL[lang];
      } else if (service_status === ServiceStatus_POS.ERROR.code) {
        statusName = ServiceStatus_POS.ERROR[lang];
      }
      return { statusName, actionBtn };
    }
  },
  LetterTable: {
    CONDITION: [
      { fieldId: 'letter', label: LETTER_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      isWaitDeal
    ],
    COLUMNS: [
      {
        title: TITLE[lang], dataIndex: 'title', sorter: true, width: "40%", render: (title, item) => <a><Tag color="blue">{LetterType[item.msg_type][lang]}</Tag>&nbsp;{title}</a>,
        onCell: (item) => ({
          onClick: () => {
            const callback = (res) => {
              const { item: { id, title: t, content: c, send_date, read_date, is_read, msg_type } } = res;
              const title = <span><Tag color="blue">{LetterType[msg_type][lang]}</Tag>&nbsp;{t}&nbsp;[<b>{Read[is_read][lang]}</b>]</span>;
              const content = (
                <div>
                  <p>{c}</p>
                  <div style={{ float: "right" }}>
                    <div>{DELIVERY_DATE[lang]}：{send_date}</div>
                    <div>{LETTER_READ_DATE[lang]}：{read_date}</div>
                  </div>
                  <div style={{ clear: "both" }} />
                </div>
              );
              const okText = LetterAPI.READ.desc[lang];
              const cancelText = CLOSE[lang];
              const okButtonProps = { style: { display: Bool[is_read].flag ? 'none' : 'block' } };
              const onOk = () => window.g_app._store.dispatch({ type: "common/handle", payload: { netUrl: LetterAPI.READ.url, items: [{ id, name: t }] } });
              Modal.confirm({ iconType: "mail", title, content, width: 610, okText, onOk, cancelText, okButtonProps });
            }
            window.g_app._store.dispatch({ type: "common/handle", payload: { netUrl: LetterAPI.DETAIL.url, items: [{ id: item.id, name: item.title }] }, callback });
          }
        })
      },
      { title: INSERT_DATE[lang], dataIndex: 'send_date', sorter: true, width: "20%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.LetterTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "30%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { DELETE, REMOVE, REVERT, READ } = api;
      const { is_del, s_is_del, is_read } = item;
      let actionBtn = [];
      let statusName = "";
      const statusStr = `${is_del}${is_read}${s_is_del}`;
      if (statusStr.indexOf("1") === 0) {
        actionBtn = [REVERT, REMOVE];
        statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
      }
      if (statusStr.charAt(2) === "1") {
        actionBtn = [REVERT, REMOVE];
        statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
      }
      if (statusStr.indexOf("01") === 0 || statusStr.lastIndexOf("10") === 0) {
        actionBtn = [DELETE];
        statusName = ActionStatus_POS.READ[lang];
      }
      if (statusStr.indexOf("00") === 0 || statusStr.lastIndexOf("00") === 0) {
        actionBtn = [READ, DELETE];
        statusName = ActionStatus_POS.UNREAD[lang];
      }
      return { statusName, actionBtn };
    }
  },
  ReviewTable: {
    CONDITION: [
      { fieldId: 'order', label: ORDER_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'product', label: PRODUCT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      adminName.code === 1 && isWaitDeal
    ],
    COLUMNS: [
      { title: ORDER_NO[lang], dataIndex: 'order_no', width: 250, fixed: "left" },
      { title: PRODUCT_CODE[lang], dataIndex: 'product_code', width: 150 },
      { title: REVIEW_PRODUCT[lang], dataIndex: 'product_name', width: 200 },
      { title: REVIEW_LEVEL[lang], dataIndex: 'level', sorter: true, width: 200, render: (level) => <Rate allowHalf defaultValue={level} count={5} disabled /> },
      { title: REVIEW_COMMENT[lang], dataIndex: 'text', width: 200, render: (text) => <span>{text || "无评论"}</span> },
      { title: REVIEW_PICTURE[lang], dataIndex: 'image_url', width: 100, render: (image_url) => image_url && <img src={`${imgPrefix}/${image_url}`} height="60px" width="60px" alt={NO_PIC[lang]} /> },
      { title: REVIEW_IS_ADDITIONAL_COMMENT[lang], dataIndex: 'has_add_to', width: 100, render: (has_add_to) => <Tag color="blue">{Bool[has_add_to][lang]}</Tag> },
      { title: REVIEW_ADDITIONAL_COMMENT[lang], dataIndex: 'text2', width: 200, render: (text2) => <span>{text2 || "无追评"}</span> },
      { title: REVIEW_ADDITIONAL_PICTURE[lang], dataIndex: 'image_url2', width: 100, render: (image_url2) => image_url2 && <img src={`${imgPrefix}/${image_url2}`} height="60px" width="60px" alt="追评图片" /> },
      { title: REVIEW_ACCOUNT[lang], dataIndex: 'user_name', width: 100 },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: 100, render: (_, item) => <Tag color="blue">{TableConfig.ReviewTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    ACTION_COLUMN_CONFIG: { width: 200, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { CHECKPASS, CHECKUNPASS, TOP, UNTOP, SHOW, UNSHOW } = api;
      const { check_status, is_show, is_top } = item;
      let actionBtn = [];
      let statusName = "";
      // const statusStr = `${check_status}${is_show}${is_top}`;
      if (adminName.code === 1) {
        if (check_status === CheckStatus_POS.WAIT.code) {
          actionBtn = [CHECKPASS, CHECKUNPASS];
          statusName = CheckStatus_POS.WAIT[lang];
        }
        if (check_status === CheckStatus_POS.NOPASS.code) {
          statusName = CheckStatus_POS.NOPASS[lang];
        }
        if (check_status === CheckStatus_POS.PASS.code) {
          if (is_show === Show_POS.UNSHOW.code) statusName = Show_POS.UNSHOW[lang];
          if (is_show === Show_POS.SHOW.code) {
            if (is_top === Top_POS.UNTOP.code) statusName = Top_POS.UNTOP[lang];
            if (is_top === Top_POS.TOP.code) statusName = Top_POS.TOP[lang];
          }
        }
      } else if (adminName.code === 2) {
        if (check_status === CheckStatus_POS.PASS.code) {
          if (is_show === Show_POS.UNSHOW.code) {
            statusName = Show_POS.UNSHOW[lang];
            actionBtn = [SHOW];
          }
          if (is_show === Show_POS.SHOW.code) {
            if (is_top === Top_POS.UNTOP.code) {
              actionBtn = [TOP, UNSHOW];
              statusName = Top_POS.UNTOP[lang];
            }
            if (is_top === Top_POS.TOP.code) {
              actionBtn = [UNTOP, UNSHOW];
              statusName = Top_POS.TOP[lang];
            }
          }
        }
      } else if (adminName.code === 3) {
        if (check_status === CheckStatus_POS.PASS.code) {
          if (is_show === Show_POS.SHOW.code) {
            if (is_top === Top_POS.UNTOP.code) {
              statusName = Show_POS.SHOW[lang];
            }
            if (is_top === Top_POS.TOP.code) {
              statusName = Top_POS.TOP[lang];
            }
          }
        }
      }
      return { statusName, actionBtn };
    }
  },
  CouponTable: {
    CONDITION: [
      { fieldId: 'coupon', label: COUPON_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: COUPON_NAME[lang], dataIndex: 'name', sorter: true, fixed: 'left', width: 200 },
      { title: TYPE[lang], dataIndex: 'coupon_type', width: 150, render: (coupon_type) => <span>{CouponType[coupon_type][lang]}</span> },
      { title: COUPON_DISCOUNTS[lang], dataIndex: 'amount', width: 150, render: (amount, item) => <span>满{amount}元减{item.discount}元</span> },
      { title: COUPON_RECEPTION[lang], dataIndex: 'send_count', width: 250, render: (send_count, item) => <Row><Col span={8}>总: {send_count}</Col><Col span={8}>领: {item.get_count}</Col><Col span={8}>用: {item.used_count}</Col></Row> },
      { title: COUPON_IS_OPEN[lang], dataIndex: 'is_open', width: 50, render: (is_open) => <Tag color="blue">{Bool[is_open][lang]}</Tag> },
      { title: COUPON_IS_FIRST[lang], dataIndex: 'is_first_buy', width: 50, render: (is_first_buy) => <Tag color="blue">{Bool[is_first_buy][lang]}</Tag> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: 100 },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: 100 },
      ...commonMarketingColumns,
      { title: INSERT_DATE[lang], dataIndex: 'ins_date', sorter: true, width: 200 },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: 100, render: (_, item) => <Tag color="blue">{TableConfig.CouponTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    ACTION_COLUMN_CONFIG: { width: 200, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, REMOVE, REVERT, ACT, UNACT } = api;
      const { is_del, is_lock, s_is_del, s_is_lock, is_act } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_del}${is_lock}${s_is_del}${s_is_lock}${is_act}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("00000") === 0) {
          actionBtn = [ACT, LOCK, FORM];
          statusName = ActionStatus_POS.UNACT[lang];
        }
        if (statusStr.indexOf("00001") === 0) {
          actionBtn = [UNACT, LOCK];
          statusName = ActionStatus_POS.ACT[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_del}${is_lock}${is_act}`;
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("00000") === 0) {
          actionBtn = [ACT, LOCK, FORM];
          statusName = ActionStatus_POS.UNACT[lang];
        }
        if (statusStr.indexOf("00001") === 0) {
          actionBtn = [UNACT, LOCK];
          statusName = ActionStatus_POS.ACT[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  GroupBuyTable: {
    CONDITION: [
      { fieldId: 'group_buy', label: GROUPBUY_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'product', label: PRODUCT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: GROUPBUY_NAME[lang], dataIndex: 'name', sorter: true, width: 150, render: (name) => <span>{name || "未命名"}</span> },
      { title: GROUPBUY_PRICE[lang], dataIndex: 'price', width: 100, render: (price) => <span>{price}元</span> },
      { title: GROUPBUY_QUANTITY[lang], dataIndex: 'product_count', width: 100, render: (product_count) => <span>{product_count}件</span> },
      { title: GROUPBUY_PARTICIPANTS[lang], dataIndex: 'count', width: 100, render: (count) => <span>{count}人</span> },
      { title: GROUPBUY_PERSONAL_RESTRICTION[lang], dataIndex: 'max_count', width: 100, render: (max_count) => <span>{max_count}件</span> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: 100 },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: 100 },
      ...commonMarketingColumns,
      { title: SEQUENCE[lang], dataIndex: 'sequence', width: 100, sorter: true },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: 100, render: (_, item) => <Tag color="blue">{TableConfig.GroupBuyTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    ACTION_COLUMN_CONFIG: { width: 200, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, CHECKPASS, CHECKUNPASS, REMOVE, REVERT, ACT, UNACT } = api;
      const { is_lock, s_is_del, s_is_lock, check_status, is_act } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_lock}${s_is_del}${s_is_lock}${check_status}${is_act}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [UNLOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("000") === 0) {
          actionBtn = [LOCK, FORM, CHECKPASS, CHECKUNPASS];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("0002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
        if (statusStr.indexOf("00011") === 0) {
          actionBtn = [UNACT, LOCK];
          statusName = ActionStatus_POS.ACT[lang];
        }
        if (statusStr.indexOf("00010") === 0) {
          actionBtn = [ACT, LOCK];
          statusName = ActionStatus_POS.UNACT[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_lock}${check_status}${is_act}`;
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REMOVE, REVERT];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [LOCK, FORM];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("0002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
        if (statusStr.indexOf("00011") === 0) {
          actionBtn = [UNACT, LOCK];
          statusName = ActionStatus_POS.ACT[lang];
        }
        if (statusStr.indexOf("00010") === 0) {
          actionBtn = [ACT, LOCK];
          statusName = ActionStatus_POS.UNACT[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  PromotionTable: {
    CONDITION: [
      { fieldId: 'promotion', label: PROMOTION_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'product', label: PRODUCT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: PROMOTION_NAME[lang], dataIndex: 'name', sorter: true, width: 200, },
      { title: TYPE[lang], dataIndex: 'promotion_type', width: 100, render: (promotion_type) => <span>{PromotionType[promotion_type][lang]}</span> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: 100 },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: 100 },
      ...commonMarketingColumns,
      { title: INSERT_DATE[lang], dataIndex: 'ins_date', width: 200, sorter: true },
      { title: INSERT_CREATOR[lang], dataIndex: 'ins_user', width: 150 },
      { title: SEQUENCE[lang], dataIndex: 'sequence', sorter: true, width: 100 },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: 100, render: (_, item) => <Tag color="blue">{TableConfig.PromotionTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    ACTION_COLUMN_CONFIG: { width: 200, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, CHECKPASS, CHECKUNPASS, REMOVE, REVERT, ACT, UNACT } = api;
      const { is_lock, s_is_del, s_is_lock, check_status, is_act } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_lock}${s_is_del}${s_is_lock}${check_status}${is_act}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [UNLOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("000") === 0) {
          actionBtn = [LOCK, FORM, CHECKPASS, CHECKUNPASS];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("0002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
        if (statusStr.indexOf("00011") === 0) {
          actionBtn = [UNACT, LOCK];
          statusName = ActionStatus_POS.ACT[lang];
        }
        if (statusStr.indexOf("00010") === 0) {
          actionBtn = [ACT, LOCK];
          statusName = ActionStatus_POS.UNACT[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_lock}${check_status}${is_act}`;
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REMOVE, REVERT];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [LOCK, FORM];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("0002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
        if (statusStr.indexOf("00011") === 0) {
          actionBtn = [UNACT, LOCK];
          statusName = ActionStatus_POS.ACT[lang];
        }
        if (statusStr.indexOf("00010") === 0) {
          actionBtn = [ACT, LOCK];
          statusName = ActionStatus_POS.UNACT[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  CountDownTable: {
    CONDITION: [
      { fieldId: 'count_down', label: COUNTDOWN_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'product', label: PRODUCT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: COUNTDOWN_NAME[lang], dataIndex: 'name', sorter: true, fixed: 'left', width: 200, render: (name) => <span>{name || "未命名"}</span>, },
      { title: COUNTDOWN_LIMITED_PRICE[lang], dataIndex: 'price', width: 100, render: (price) => <span>{price}元</span> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: 100 },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: 100 },
      ...commonMarketingColumns,
      { title: INSERT_DATE[lang], dataIndex: 'ins_date', key: 'ins_date', sorter: true, width: 200 },
      { title: SEQUENCE[lang], dataIndex: 'sequence', width: 100, sorter: true },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: 100, render: (_, item) => <Tag color="blue">{TableConfig.CountDownTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    ACTION_COLUMN_CONFIG: { width: 200, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, CHECKPASS, CHECKUNPASS, REMOVE, REVERT, ACT, UNACT } = api;
      const { is_lock, s_is_del, s_is_lock, check_status, is_act } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_lock}${s_is_del}${s_is_lock}${check_status}${is_act}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [UNLOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("000") === 0) {
          actionBtn = [LOCK, FORM, CHECKPASS, CHECKUNPASS];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("0002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
        if (statusStr.indexOf("00011") === 0) {
          actionBtn = [UNACT, LOCK];
          statusName = ActionStatus_POS.ACT[lang];
        }
        if (statusStr.indexOf("00010") === 0) {
          actionBtn = [ACT, LOCK];
          statusName = ActionStatus_POS.UNACT[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_lock}${check_status}${is_act}`;
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REMOVE, REVERT];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [LOCK, FORM];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("0002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
        if (statusStr.indexOf("00011") === 0) {
          actionBtn = [UNACT, LOCK];
          statusName = ActionStatus_POS.ACT[lang];
        }
        if (statusStr.indexOf("00010") === 0) {
          actionBtn = [ACT, LOCK];
          statusName = ActionStatus_POS.UNACT[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  GroupTable: {
    CONDITION: [
      { fieldId: 'group', label: GROUP_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
      { fieldId: 'product', label: PRODUCT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: GROUP_NAME[lang], dataIndex: 'name', sorter: true, width: "10%", render: (name) => <span>{name || "未命名"}</span> },
      { title: GROUP_PRICE[lang], dataIndex: 'price', width: "10%", render: (price) => <span>￥{price}</span> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: "10%" },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: "10%" },
      { title: VALID_TIME[lang], dataIndex: 'start_date', width: "20%", render: (start_date, item) => <span>{start_date}<br />{item.end_date}</span> },
      { title: SEQUENCE[lang], dataIndex: 'sequence', width: "10%", sorter: true },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.GroupTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width: "20%"},
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, CHECKPASS, CHECKUNPASS, REMOVE, REVERT, ACT, UNACT } = api;
      const { is_lock, s_is_del, s_is_lock, check_status, is_act } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_lock}${s_is_del}${s_is_lock}${check_status}${is_act}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [UNLOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("000") === 0) {
          actionBtn = [LOCK, FORM, CHECKPASS, CHECKUNPASS];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("0002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
        if (statusStr.indexOf("00011") === 0) {
          actionBtn = [UNACT, LOCK];
          statusName = ActionStatus_POS.ACT[lang];
        }
        if (statusStr.indexOf("00010") === 0) {
          actionBtn = [ACT, LOCK];
          statusName = ActionStatus_POS.UNACT[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_lock}${check_status}${is_act}`;
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REMOVE, REVERT];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [LOCK, FORM];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("0002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
        if (statusStr.indexOf("00011") === 0) {
          actionBtn = [UNACT, LOCK];
          statusName = ActionStatus_POS.ACT[lang];
        }
        if (statusStr.indexOf("00010") === 0) {
          actionBtn = [ACT, LOCK];
          statusName = ActionStatus_POS.UNACT[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  SpecialTable: {
    CONDITION: [
      { fieldId: 'product', label: PRODUCT_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: '', dataIndex: 'image_url', width: 100, fixed: "left", render: (_, item) => <img src={`${imgPrefix}/${item.product.image_url}`} height="60px" width="60px" alt="商品图片" /> },
      { title: PRODUCT_NAME[lang], dataIndex: 'name', sorter: true, width: 200, fixed: "left", render: (_, item) => <span>{item.product.name}</span> },
      { title: PRODUCT_SPECIAL_PRICE[lang], dataIndex: 'price', sorter: true, width: 150 },
      { title: PRODUCT_SALE_PRICE[lang], dataIndex: 'sale_price', sorter: true, width: 150, render: (_, item) => <span>{item.product.sale_price}</span> },
      { title: BRAND_NAME[lang], dataIndex: 'brand', width: 100, render: (_, item) => <span>{item.product.brand.name}</span> },
      { title: PRODUCT_CODE[lang], dataIndex: 'code', width: 100, render: (_, item) => <span>{item.product.code}</span> },
      { title: PRODUCT_SPECIFICATION[lang], dataIndex: 'specification', width: 200, render: (_, item) => <span>{item.product.specification}</span> },
      { title: PRODUCT_MODEL[lang], dataIndex: 'model', width: 100, render: (_, item) => <span>{item.product.model}</span> },
      { title: WAREHOUSE_NAME[lang], dataIndex: 'ware_type', width: 100, render: (_, item) => <span>{WareType[item.product.ware_type][lang]}</span> },
      { title: USE[lang], dataIndex: 'is_act', width: 100, render: (val) => <span>{Act[val][lang]}</span> },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: 100 },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: 100 },
    ],
    ACTION_COLUMN_CONFIG: { width: 100, fixed: "right" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      // 只有supplier才有action，平台没有
      const { FORM, ACT, UNACT } = api;
      const { is_act } = item;
      let actionBtn = [];
      let statusName = "";
      if (is_act === Act_POS.UNACT.code) {
        actionBtn = [ACT, FORM];
        statusName = Act_POS.UNACT[lang];
      }
      if (is_act === Act_POS.ACT.code) {
        actionBtn = [UNACT];
        statusName = Act_POS.ACT[lang];
      }
      return { statusName, actionBtn };
    }
  },
  RoleTable: {
    CONDITION: [
      { fieldId: 'role', label: ROLE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: ROLE_NAME[lang], dataIndex: 'name', width: "20%" },
      { title: SEQUENCE[lang], dataIndex: 'sequence', width: "10%" },
      { title: OWNER_TYPE[lang], dataIndex: 'owner_type', width: "20%", render: (owner_type) => <span>{OwnerType[owner_type][lang]}</span> },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.RoleTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width:"40%"},
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, REMOVE, REVERT } = api;
      const { is_del, is_lock, s_is_del, s_is_lock } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_del}${is_lock}${s_is_del}${s_is_lock}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_del}${is_lock}`;
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  ManagerTable: {
    CONDITION: [
      { fieldId: 'user_name', label: MANAGER_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: MANAGER_NAME[lang], dataIndex: 'user_name', width: "10%" },
      { title: MANAGER_ROLE_NAME[lang], dataIndex: 'role_name', width: "10%" },
      { title: MANAGER_IS_ROOT[lang], dataIndex: 'is_root', width: "10%", render: (val) => <Tag color="blue">{Root[val][lang]}</Tag> },
      { title: PHONE[lang], dataIndex: 'phone', width: "15%" },
      { title: EMAIL[lang], dataIndex: 'email', width: "15%" },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: "10%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.ManagerTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width:"20%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, REMOVE } = api;
      const actionBtn = item.is_root === Root_POS.OWN_RIGHT.code ? [FORM, REMOVE] : [];
      const statusName = ActionStatus_POS.ENABLE[lang];
      return { statusName, actionBtn };
    }
  },
  ManagerLogTable: {
    CONDITION: [
      { fieldId: 'assort_id', label: MANAGER_SEARCH[lang], fieldType: 'select', fieldProps: { options: Object.values(Assort_POS).map(i => ({ label: i[lang], value: i.code })) }, colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: MANAGERLOG_CONTENT[lang], dataIndex: 'content', width: 600, render: (val, item) => <Fragment><Tag color="blue">{Action[item.action_id][lang]}</Tag><Tag color="blue">{Action[item.assort_id][lang]}</Tag> {val}</Fragment> },
      { title: ADMIN[lang], dataIndex: 'admin', width: 200, render: (val, item) => <span>{val}({PlatType[item.manager_type][lang]})</span> },
      { title: MANAGERLOG_LOG_DATE[lang], dataIndex: 'log_date', width: 200 },
      { title: IP[lang], dataIndex: 'ip', width: 100 },
      { title: REMARK[lang], dataIndex: 'remark', width: 100 },
      { title: OWNER_ID[lang], dataIndex: 'owner_id', width: 100, render: (val, item) => <span>{val}({OwnerType[item.owner_type][lang]})</span> },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.ManagerLogTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { REMOVE } = api;
      const actionBtn = [REMOVE];
      const statusName = ActionStatus_POS.ENABLE[lang];
      return { statusName, actionBtn };
    }
  },
  ShowNavTable: {
    CONDITION: [],
    COLUMNS: [
      { title: TYPE[lang], dataIndex: 'show_nav_type', width: "15%", render: (val) => <Tag color="blue">{ShowNavType[val][lang]}</Tag> },
      { title: SHOWNAV_CATEGORY[lang], dataIndex: 'category_ids', width: "15%",render:(val)=>AllCategory[val[0]].category[val[1]].category[val[2]] },
      { title: SHOWNAV_JUMP_TO[lang], dataIndex: 'jump_to', width: "20%" },
      { title: SEQUENCE[lang], dataIndex: 'sequence', width: "10%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.ShowNavTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width:"20%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, DELETE, REMOVE, REVERT } = api;
      const { is_del, is_lock, s_is_del, s_is_lock } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_del}${is_lock}${s_is_del}${s_is_lock}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_del}${is_lock}`;
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("0000") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
  ModuleTable: {
    CONDITION: [
      { fieldId: 'name', label: MODULE_SEARCH[lang], fieldType: 'input', colLayout: { span: 8 } },
    ],
    COLUMNS: [
      { title: MODULE_SRC[lang], dataIndex: 'src', width: "20%", render: (url) => <img src={`${imgPrefix}/${url}`} height="60px" width="60px" alt="" /> },
      { title: MODULE_NAME[lang], dataIndex: 'name', width: "20%" },
      { title: OWNER_NAME[lang], dataIndex: 'owner_name', width: "10%" },
      { title: SEQUENCE[lang], dataIndex: 'sequence', width: "10%" },
      { title: STATUS[lang], dataIndex: 'itemStatus', width: "10%", render: (_, item) => <Tag color="blue">{TableConfig.ShowNavTable.ACTION_STATUS_BUTTON(item).statusName}</Tag> },
    ],
    // ACTION_COLUMN_CONFIG: { width:"20%" },
    ACTION_STATUS_BUTTON: (item, api = {}) => {
      const { FORM, LOCK, UNLOCK, CHECKPASS, CHECKUNPASS, DELETE, REMOVE, REVERT } = api;
      const { is_del, is_lock, s_is_del, s_is_lock, check_status } = item;
      let actionBtn = [];
      let statusName = "";
      let statusStr = `${is_del}${is_lock}${s_is_del}${s_is_lock}${check_status}`;
      if (adminName.code === 1) {
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("00000") === 0) {
          actionBtn = [FORM, CHECKPASS, CHECKUNPASS, LOCK];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("00001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
        if (statusStr.indexOf("00002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
      } else {
        statusStr = `${s_is_del}${s_is_lock}${is_del}${is_lock}${check_status}`
        if (statusStr.indexOf("1") === 0) {
          actionBtn = [REVERT, REMOVE];
          statusName = ActionStatus_POS.MERCHANT_DELETE[lang];
        }
        if (statusStr.indexOf("01") === 0) {
          actionBtn = [UNLOCK, DELETE];
          statusName = ActionStatus_POS.MERCHANT_LOCK[lang];
        }
        if (statusStr.indexOf("001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_DELETE[lang];
        }
        if (statusStr.indexOf("0001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.PLATFORM_LOCK[lang];
        }
        if (statusStr.indexOf("00000") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_WAIT[lang];
        }
        if (statusStr.indexOf("00001") === 0) {
          actionBtn = [LOCK];
          statusName = ActionStatus_POS.ENABLE[lang];
        }
        if (statusStr.indexOf("00002") === 0) {
          actionBtn = [FORM, LOCK];
          statusName = ActionStatus_POS.CHECK_FAIL[lang];
        }
      }
      return { statusName, actionBtn };
    }
  },
}

const handleTableChange = (pagination, filters, sorter, request) => {
  const { current: index, pageSize: size } = pagination;
  const { columnKey, order } = sorter;
  const sort = SortField[columnKey].code;
  const direction = order === "descend" ? 1 : 0;
  request({ index, size, direction, sort });
}

const commonHandleSelectRows = (keys, items, selectedItems, handleSetState) => {
  let newItems = [];
  if (selectedItems.length === keys.length) {
    newItems = items;
  } else if (selectedItems.length < keys.length) {
    newItems = [...selectedItems.filter(i => items.every(v => i.id !== v.id)), ...items];
  } else {
    newItems = selectedItems.filter(i => keys.some(v => v === i.id));
  }
  handleSetState({ selectedRowKeys: keys, selectedItems: newItems });
}
const commontoggleEditorialPanel = ({ topState, handleSetState }) => handleSetState({ editorialPanelVisible: !topState.editorialPanelVisible })
const commonHandleQuery = ({ queryObj, handleSetState, request }) => handleSetState({ condition: queryObj }, () => request({ index: 1 }));
const commonHandleChangeManagerTypeTabs = ({ key, handleSetState, request, netUrl }) => handleSetState({ managerType: parseInt(key, 10), selectedRowKeys: [], selectedItems: [], condition: {} }, () => request({ netUrl, index: 1 }));
const commonHandleItems = ({ action, item, selectedItems, request, topState, handleSetState }) => {
  const { url: netUrl, desc, actionTip } = action;
  let content = "";
  let items = [];
  if (item) {
    const { id, name, product_name, user_name } = item;
    items = [{ id, name }];
    if (netUrl.includes(ReviewAPI.BASE_URL)) items = [{ id, name: product_name }];// 商品评价特殊处理
    if (netUrl.includes(ManagerAPI.BASE_URL)) items = [{ id, name: user_name }];// 管理员特殊处理
    content = `【${items[0].name}】${actionTip[lang]}`;
  } else {
    items = selectedItems.map(v => ({ id: v.id, name: v.name }));
    if (netUrl.includes(ReviewAPI.BASE_URL)) items = selectedItems.map(v => ({ id: v.id, name: v.product_name }));// 商品评价特殊处理
    if (netUrl.includes(ReviewAPI.BASE_URL)) items = selectedItems.map(v => ({ id: v.id, name: v.user_name }));// 商品评价特殊处理
    content = lang === "zh_CN" ? `注意：【${items[0].name}......】等多个所选项${actionTip[lang]}` : `warnning：Such as【${items[0].name}......】,they ${actionTip[lang]}`;
  }
  const title = lang === "zh_CN" ? `确定${desc[lang]}吗？` : `Do you want to ${desc[lang]} what you have selected?`;
  const okText = confirmButtonName[lang];
  const cancelText = CANCEL[lang];
  // const onCancel = () => request();// 有必要刷新吗？
  const onCancel = () => { };
  const onOk = () => {
    if (netUrl.includes("/form")) commontoggleEditorialPanel({ topState, handleSetState });
    if (netUrl.includes("/record")) {
      commontoggleEditorialPanel({ topState, handleSetState });
      handleSetState({ localFormItem: item });
      return;
    }
    request({ netUrl, items });
  }
  Modal.confirm({ title, content, okText, cancelText, onCancel, onOk });
}


const getTableConfig = ({ hasBaseTable = true, hasBaseTableAction = true, hasInsertAction = true, topProps = {}, topState = {}, api, baseTableProps, handleSetState, request, toggleExportBox, cleanSelectedItem, customHandleItems, customHandleSelectRows, extraSelectedConditions = [], additionalComponent = {}, EditorialForm, tabList }) => {
  const { selectedItems = [], selectedRowKeys = [], editorialPanelVisible, condition, localFormItem, managerType = adminName.code } = topState;
  const { common: { list = [], total = 10, index = 1, size = 10, formItem }, loading } = topProps;
  const handleItems = customHandleItems || commonHandleItems;
  const handleSelectRows = commonHandleSelectRows || customHandleSelectRows;
  const { BASE_URL, LIST } = api;
  const tableKey = Object.keys(TableConfig).filter(i => i.toLowerCase() === `${BASE_URL.substring(1)}table`)[0];
  const { COLUMNS, CONDITION, ACTION_COLUMN_CONFIG, ACTION_STATUS_BUTTON } = TableConfig[tableKey];
  // let columns =COLUMNS.filter(i => !["owner_name", "owner_id", "owner_type"].includes(i.dataIndex));
  let columns = managerType !== adminName.code ? COLUMNS : COLUMNS.filter(i => !["owner_name", "owner_id", "owner_type"].includes(i.dataIndex));
  const modalFormConfig = [...CONDITION, ...extraSelectedConditions];
  const handleItemsParams = { selectedItems, request, topState, handleSetState };
  const buttonCollection = {};
  // selectedItems.forEach(item => {
  //   ACTION_STATUS_BUTTON(item, api).actionBtn.forEach(i=>{
  //     if(!i) return;
  //     const actionName=i.url.split("/")[2];
  //     if(!["form","insert", "update", "record", "checkpass", "checkunpass", "recordpass", "recordunpass", "detail"].includes(actionName)){
  //       buttonCollection[actionName]=i;
  //     }
  //   });
  // });
  // const batchOperations =managerType !== adminName.code?[]:Object.values(buttonCollection).map(i => <Menu.Item key={JSON.stringify(i)}>{i.desc[lang]}</Menu.Item>);

  selectedItems.forEach(item => {
    ACTION_STATUS_BUTTON(item, api).actionBtn.forEach(i => {
      if (!i) return;
      const actionName = i.url.split("/")[2];
      if (!["form", "insert", "update", "detail", "record"].includes(actionName)) buttonCollection[actionName] = i;
    });
  });
  const batchOperations = Object.values(buttonCollection).map(i => <Menu.Item key={JSON.stringify(i)}>{i.desc[lang]}</Menu.Item>);


  const menu = <Menu onClick={({ key }) => handleItems({ action: JSON.parse(key), item: null, ...handleItemsParams })}>{batchOperations}</Menu>;
  if (hasBaseTableAction) {
    const getActionButton = (item, actions) => actions.map(action => {
      // if (managerType !== adminName.code || !action) return undefined;
      if (!action) return undefined;
      if (managerType !== adminName.code) {
        const arr = action.url.split("/");
        const lastUrl = arr[arr.length - 1];
        const enableActions = ["lock", "unlock", "checkpass", "checkunpass", "record"];
        if (arr[1] === ProductAPI.BASE_URL) enableActions.push("delete", "revert", "remove");
        if (!enableActions.includes(lastUrl)) return undefined;
      }
      const btn = <Button type="primary" size="small" style={{ margin: "0px 4px" }} onClick={() => handleItems({ action, item, ...handleItemsParams })}>{action.desc[lang]}</Button>;
      return btn;
    });
    columns = [...columns, {
      title: ACTION[lang], dataIndex: 'action', ...ACTION_COLUMN_CONFIG, render: (_, item) => getActionButton(item, ACTION_STATUS_BUTTON(item, api).actionBtn)
    }];
  }
  return (
    <PageHeaderLayout tabList={tabList} onTabChange={(key) => commonHandleChangeManagerTypeTabs({ key, handleSetState, request, netUrl: LIST.url })}>
      <Card>
        <ConditionQuery {...{ modalFormConfig, condition, lang }} onQuery={(queryObj) => commonHandleQuery({ queryObj, handleSetState, request })} />
        {hasInsertAction && <Button style={{ marginRight: "10px" }} icon="plus" type="primary" onClick={() => commontoggleEditorialPanel({ topState, handleSetState })}>{NEW[lang]}</Button>}
        {toggleExportBox && <Button style={{ marginRight: "10px" }} icon="copy" type="primary" onClick={toggleExportBox}>{EXPORT[lang]}</Button>}
        {selectedItems.length > 0 && batchOperations.length > 0 && <Dropdown overlay={menu}><Button>{BATCH_OPERATION[lang]}<Icon type="down" /></Button></Dropdown>}
        {hasBaseTable &&
          <StandardTable
            number={selectedItems.length}
            columns={columns}
            rowKey={item => item.id}
            lang={lang}
            onChange={(pagination, filters, sorter) => handleTableChange(pagination, filters, sorter, request)}
            rowSelection={hasBaseTableAction ? { selectedRowKeys, onChange: (keys, items) => handleSelectRows(keys, items, selectedItems, handleSetState) } : undefined}
            loading={loading}
            dataSource={list}
            cleanSelectedItem={cleanSelectedItem}
            pagination={{ showQuickJumper: true, showSizeChanger: true, current: index, total, pageSize: size }}
            {...baseTableProps}
          />
        }
        {editorialPanelVisible &&
          <EditorialForm
            editorialPanelVisible={editorialPanelVisible}
            toggleEditorialPanel={() => commontoggleEditorialPanel({ topState, handleSetState })}
            request={request}
            formItem={localFormItem || formItem}
            lang={lang}
            handleSetState={handleSetState}
          />
        }
        {Object.keys(additionalComponent).map((i) => <div key={i} style={{ marginTop: "20px" }}>{additionalComponent[i]}</div>)}
      </Card>
    </PageHeaderLayout>
  )
}

TableConfig.getTableConfig = getTableConfig;
TableConfig.handleTableChange = handleTableChange;
TableConfig.handleSelectRows = commonHandleSelectRows;
TableConfig.handleItems = commonHandleItems;
TableConfig.onQuery = commonHandleQuery;
TableConfig.commontoggleEditorialPanel = commontoggleEditorialPanel;
export default TableConfig;




