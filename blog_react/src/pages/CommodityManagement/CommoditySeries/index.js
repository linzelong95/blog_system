import React from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { UrlEnum,SystemEnum } from '@/assets/Enum';
import TableConfig from '@/pages/TableConfig';

const { SeriesAPI } = UrlEnum;
const { getTableConfig, ProductTable: { COLUMNS_MINI } } = TableConfig;
const {PlatType_POS:{SUPPLIER}}=SystemEnum;


@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
class CommoditySeries extends React.PureComponent {
  state = {
    condition: {},
    selectedItems: [],// 已勾选的选项集合
    selectedRowKeys: [],// 已勾选的选项在表格的序号集合
    managerType:SUPPLIER.code
  };

  componentDidMount = () => this.request({ index: 1, size: 10 });

  request = (params, callback) => {
    const {condition,managerType:manager_type}=this.state;
    const payload = { netUrl: SeriesAPI.LIST.url, manager_type,condition, ...params };
    this.props.dispatch({ type: "common/handle", payload, callback});
    if(payload.netUrl!==SeriesAPI.LIST.url) this.cleanSelectedItem();
  }

  cleanSelectedItem = () => this.setState({ selectedRowKeys: [], selectedItems: [] });
  
  handleSetState = (obj,func) => func?this.setState(obj,()=>func()):this.setState(obj);

  render() {
    const expandedRowRender= (record) =>(
      <Table
        dataSource={record.products}
        columns={COLUMNS_MINI}
        rowKey={row => row.id}
        pagination={!!(record.products.length > 10)}
      />
    );
    const params = {
      api: SeriesAPI,
      topProps:this.props,
      topState:this.state,
      baseTableProps:{expandedRowRender},
      cleanSelectedItem:this.cleanSelectedItem,
      handleSetState:this.handleSetState,
      request: this.request,
      hasInsertAction:false,
    };
    return getTableConfig(params);
  }
}

export default CommoditySeries;
