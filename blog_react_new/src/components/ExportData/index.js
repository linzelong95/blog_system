import React, { Fragment } from 'react';
import { Modal, Row, Col, Checkbox, Radio, Tooltip } from 'antd';
import { exportToExcel } from '@/utils/utils';
import { ProductEnum, OrderEnum, MarketEnum} from '@/assets/Enum';

const { SaleStatus,WareType } = ProductEnum;
const { OrderStatus,PriceType } = OrderEnum;
const { CouponType } = MarketEnum;

export default class ExportData extends React.Component {
  state = {
    options: "all",// 打印范围（所有、本页、所选），默认所有
    selectedTags: [],// 打印内容的标题
  };

  /**
   * 选择需要打印的内容
   *
   * @param {Array} selectedTags 标题行
   * @memberof ExportData
   */
  handleOnchange = (selectedTags) => this.setState({ selectedTags });

  /**
   * 选择打印范围
   * 
   * @param {Element} e dom元素
   * @memberof ExportData
   */
  chooseAllOrPart = (e) => this.setState({ options: e.target.value });

  /**
   * 确认导出数据
   *
   * @memberof ExportData
   */
  handleOk = () => {
    const { options, selectedTags } = this.state;
    const { list, selectedRows, cleanSelectedRows, toggleExportBox, product, order, coupon, request, defaultValue, type,lang } = this.props;
    const fileAndSheetName = [`${type}列表`, `${type}数据`];
    const tags = selectedTags.length ? selectedTags : defaultValue;
    toggleExportBox();
    if (options==="all") {
      const callback = (res) => exportToExcel(...this.sheetTransform(res.list, tags, type,lang), ...fileAndSheetName);
      request({ size: 100, product, coupon, order }, callback);
      return;
    }
    const rows = options === "page" ? list : selectedRows;
    exportToExcel(...this.sheetTransform(rows, tags, type,lang), ...fileAndSheetName);
    cleanSelectedRows();
  }

  /**
   * 属性转化为中文（或其他自定义内容）
   * 
   * @param {Array} rows 商品信息
   * @param {Array} tags 标题行
   * @memberof ExportData
   */
  sheetTransform = (rows, tags, type,lang) => {
    let sheetHeader = [];
    const sheetData = [];
    rows.forEach(row => {
      const list = JSON.parse(JSON.stringify(row));
      sheetHeader = tags.map(item => {
        if (type === "商品") {
          switch (item) {
            case "name":return "名称";
            case "subtitle":return "副标";
            case "sale_price":return "售价";
            case "brand":return "品牌";
            case "code":return "编码";
            case "unit":return "单位";
            case "sale_status":list[item]=SaleStatus[row[item]][lang];return "状态";
            case "ware_type":list[item]=WareType[row[item]][lang];return "仓库";
            case "specification":return "规格";
            case "model":return "型号";
            case "sale_counts":return "售量";
            default:return item;
          }
        } else if (type === "order") {
          switch (item) {
            case "user_name":return "用户";
            case "order_no":return "订单号";
            case "add_date":return "下单时间";
            case "warehouse_name":return "仓库";
            case "amount":return "总价";
            case "activity_dcnt":return "活动优惠";
            case "coupon_dcnt":return "用券优惠";
            case "member_dcnt":return "会员优惠";
            case "order_status":list[item]=OrderStatus[row[item]][lang];return "订单状态";
            case "freight":return "总运费";
            case "freight_dcnt":return "运费抵扣";
            case "tax":return "总税费";
            case "tax_dcnt":return "税费抵扣";
            case "items":
              {
                const products = row[item];
                let str = "";
                products.forEach((i, index) => {
                  const priceType=PriceType[i.price_type][lang];
                  const eachOne = `【${index + 1}】 ${i.name}  ${i.attribute.join(" ")}  ${i.real_price}*${i.quantity}  ${priceType}`;
                  str += `${eachOne}------`;
                });
                list[item] = str;
              }
              return "商品详情";
            default:return item;
          }
        } else {
          switch (item) {
            case "name":return "名称";
            case "description":return "描述";
            case "coupon_type":list[item]=CouponType[row[item]][lang];return "范围";
            case "start_date":list[item] = `${row[item]} - ${row.end_date}`;return "有效期";
            case "amount":return "满减";
            case "discount":return "抵扣";
            case "is_open":list[item] = row[item] ? "公开" : "非公开";return "公私";
            case "is_first_buy":list[item] = row[item] ? "首单" : "不限制";return "条件";
            case "is_act":list[item] = row[item] ? "已启用" : "已停用";return "启用情况";
            case "send_count":return "总数量";
            case "get_count":return "已领数";
            case "used_count":return "已领数";
            case "owner_id":return "商家ID";
            case "ins_date":return "添加日期";
            default:return item;
          }
        }
      });
      sheetData.push(list);
    });
    return [sheetHeader, tags, sheetData];
  }

  render() {
    const { visible, toggleExportBox, defaultValue, type } = this.props;
    return (
      <Modal title="请选择需要导出的内容" visible={visible} onOk={this.handleOk} onCancel={toggleExportBox} maskClosable={false}>
        <Checkbox.Group style={{ width: "100%" }} onChange={this.handleOnchange} defaultValue={defaultValue}>
          <Row>
            <Col span={8} offset={9}>
              <Radio.Group defaultValue="all" size="small" buttonStyle="solid" onChange={this.chooseAllOrPart}>
                <Radio.Button value="items">所选</Radio.Button>
                <Radio.Button value="page">本页</Radio.Button>
                <Tooltip title="注意筛选与非筛条件"><Radio.Button value="all">全部</Radio.Button></Tooltip>
              </Radio.Group>
            </Col>
          </Row>
          <br />
          {
            type === "product" &&
            <Fragment>
              <Row>
                <Col span={4}><Checkbox value="id">id</Checkbox></Col>
                <Col span={4}><Checkbox value="name">名称</Checkbox></Col>
                <Col span={4}><Checkbox value="subtitle">副标</Checkbox></Col>
                <Col span={4}><Checkbox value="sale_price">售价</Checkbox></Col>
                <Col span={4}><Checkbox value="brand">品牌</Checkbox></Col>
                <Col span={4}><Checkbox value="code">编码</Checkbox></Col>
              </Row>
              <Row>
                <Col span={4}><Checkbox value="unit">单位</Checkbox></Col>
                <Col span={4}><Checkbox value="sale_status">状态</Checkbox></Col>
                <Col span={4}><Checkbox value="ware_type">仓库</Checkbox></Col>
                <Col span={4}><Checkbox value="specification">规格</Checkbox></Col>
                <Col span={4}><Checkbox value="model">型号</Checkbox></Col>
                <Col span={4}><Checkbox value="sale_counts">售量</Checkbox></Col>
              </Row>
            </Fragment>
          }
          {
            type === "order" &&
            <Fragment>
              <Row>
                <Col span={4}><Checkbox value="id">id</Checkbox></Col>
                <Col span={5}><Checkbox value="user_name">用户</Checkbox></Col>
                <Col span={5}><Checkbox value="order_no">单号</Checkbox></Col>
                <Col span={5}><Checkbox value="add_date">时间</Checkbox></Col>
                <Col span={5}><Checkbox value="warehouse_name">仓库</Checkbox></Col>
              </Row>
              <Row>
                <Col span={4}><Checkbox value="amount">总价</Checkbox></Col>
                <Col span={5}><Checkbox value="activity_dcnt">活动优惠</Checkbox></Col>
                <Col span={5}><Checkbox value="coupon_dcnt">用券优惠</Checkbox></Col>
                <Col span={5}><Checkbox value="member_dcnt">会员优惠</Checkbox></Col>
                <Col span={5}><Checkbox value="order_status">订单状态</Checkbox></Col>
              </Row>
              <Row>
                <Col span={4}><Checkbox value="freight">总运费</Checkbox></Col>
                <Col span={5}><Checkbox value="freight_dcnt">运费抵扣</Checkbox></Col>
                <Col span={5}><Checkbox value="tax">总税费</Checkbox></Col>
                <Col span={5}><Checkbox value="tax_dcnt">税费抵扣</Checkbox></Col>
                <Col span={5}><Checkbox value="items">商品详情</Checkbox></Col>
              </Row>
            </Fragment>
          }
          {
            type === "coupon" &&
            <Fragment>
              <Row>
                <Col span={4}><Checkbox value="id">id</Checkbox></Col>
                <Col span={5}><Checkbox value="name">名称</Checkbox></Col>
                <Col span={5}><Checkbox value="description">描述</Checkbox></Col>
                <Col span={5}><Checkbox value="coupon_type">范围</Checkbox></Col>
                <Col span={5}><Checkbox value="start_date">有效期</Checkbox></Col>
              </Row>
              <Row>
                <Col span={4}><Checkbox value="amount">满减</Checkbox></Col>
                <Col span={5}><Checkbox value="discount">抵扣</Checkbox></Col>
                <Col span={5}><Checkbox value="is_open">公私</Checkbox></Col>
                <Col span={5}><Checkbox value="is_first_buy">条件</Checkbox></Col>
                <Col span={5}><Checkbox value="is_act">启用情况</Checkbox></Col>
              </Row>
              <Row>
                <Col span={4}><Checkbox value="send_count">总数量</Checkbox></Col>
                <Col span={5}><Checkbox value="get_count">已领数</Checkbox></Col>
                <Col span={5}><Checkbox value="used_count">已用数</Checkbox></Col>
                <Col span={5}><Checkbox value="owner_id">商家ID</Checkbox></Col>
                <Col span={5}><Checkbox value="ins_date">添加日期</Checkbox></Col>
              </Row>
            </Fragment>
          }
        </Checkbox.Group>
      </Modal>
    );
  }
}
