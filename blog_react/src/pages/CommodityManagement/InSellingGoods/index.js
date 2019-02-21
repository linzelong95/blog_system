import React from 'react';
import { connect } from 'dva';
import ExportData from '@/components/ExportData';
import { UrlEnum,SystemEnum } from '@/assets/Enum';
import TableConfig from '@/pages/TableConfig';
import EditorialForm from './RecordEditorialForm';

const { ProductAPI } = UrlEnum;
const { getTableConfig } = TableConfig;
const {PlatType_POS:{SUPPLIER}}=SystemEnum;

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
class ProductList extends React.PureComponent {
  state = {
    condition: {},
    selectedItems: [],// 已勾选的选项集合
    selectedRowKeys: [],// 已勾选的选项在表格的序号集合
    visible: false,// 打印框可见度
    editorialPanelVisible:false,
    managerType:SUPPLIER.code,
    localFormItem:null
  };

  componentDidMount = () => this.request({ index: 1, size: 10 });

  request = (params, callback) => {
    const {condition,managerType:manager_type}=this.state;
    const payload = { netUrl: ProductAPI.LIST.url, manager_type, condition, ...params };
    this.props.dispatch({ type: "common/handle", payload, callback});
    if(payload.netUrl!==ProductAPI.LIST.url) this.cleanSelectedItem();
  }

  cleanSelectedItem = () => this.setState({ selectedRowKeys: [], selectedItems: [] });

  handleSetState = (obj,func) => func?this.setState(obj,()=>func()):this.setState(obj); // 改

  toggleExportBox=() => this.setState((oldState) => ({ visible: !oldState.visible }));

  render() {
    const { common: { list = [], lang }, } = this.props;
    const { visible, selectedItems,  condition,managerType } = this.state;
    const exportData=visible &&
      <ExportData
        visible={visible}
        list={list}
        product={condition.product}
        selectedRows={selectedItems}
        type="product"
        defaultValue={["name", "sale_price", "brand", "code"]}
        cleanSelectedRows={this.cleanSelectedItem}
        toggleExportBox={this.toggleExportBox}
        request={this.request}
        lang={lang}
      />
    const params={
      api:ProductAPI,
      topProps:this.props,
      topState:this.state,
      baseTableProps:{},
      cleanSelectedItem:this.cleanSelectedItem,
      handleSetState:this.handleSetState,
      request:this.request,
      EditorialForm,
      toggleExportBox:this.toggleExportBox,
      hasInsertAction:false,
      additionalComponent:{0:exportData}
    };
    return getTableConfig(params);
  }
}

export default ProductList;
