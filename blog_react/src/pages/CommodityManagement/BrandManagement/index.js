import React from 'react';
import { connect } from 'dva';
import EditorialForm from './PlatformEditorialForm';
import { UrlEnum,SystemEnum } from '@/assets/Enum';
import TableConfig from '@/pages/TableConfig';

const {BrandAPI, BrandSupplierAPI } = UrlEnum;
const {PlatType_POS:{PLATFORM,SUPPLIER}}=SystemEnum;
const { getTableConfig } = TableConfig;

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
class BrandManagement extends React.Component {
  state = {
    condition: {},
    editorialPanelVisible: false,
    selectedItems: [],// 勾选的选项集合
    selectedRowKeys: [],// 被勾选项的key
    managerType:PLATFORM.code
  };

  componentDidMount = () => this.request({ index: 1, size: 10 });

  request = (params, callback) => {
    const {condition,managerType:manager_type}=this.state;
    const payload = { netUrl: BrandAPI.LIST.url, manager_type,condition, ...params };
    this.props.dispatch({ type: "common/handle", payload, callback});
    if(payload.netUrl!==BrandAPI.LIST.url) this.cleanSelectedItem();
  }

  cleanSelectedItem = () => this.setState({ selectedRowKeys: [], selectedItems: [] });

  handleSetState = (obj,func) => func?this.setState(obj,()=>func()):this.setState(obj); 

  render() {
    const { common: { lang } } = this.props;
    const { managerType } = this.state;
    const tabList = [
      { key: PLATFORM.code, tab: PLATFORM[lang] },
      { key: SUPPLIER.code, tab: SUPPLIER[lang] },
    ];
    let params={
      api:BrandAPI,
      topProps:this.props,
      topState:this.state,
      baseTableProps:{},
      cleanSelectedItem:this.cleanSelectedItem,
      handleSetState:this.handleSetState,
      request:this.request,
      EditorialForm,
      tabList,
    };
    if ([SUPPLIER.code].includes(managerType)) {
      params = { ...params,hasInsertAction:false,api:BrandSupplierAPI};
    }
    return getTableConfig(params);
  }
}
export default BrandManagement;