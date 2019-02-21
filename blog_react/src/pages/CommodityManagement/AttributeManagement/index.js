import React from 'react';
import { connect } from 'dva';
import EditorialForm from './EditorialForm';
import { UrlEnum, SystemEnum } from '@/assets/Enum';
import TableConfig from '@/pages/TableConfig';

const {AttributeAPI } = UrlEnum;
const {PlatType_POS:{PLATFORM,SUPPLIER}}=SystemEnum;
const { getTableConfig } = TableConfig;

@connect(({ loading, common }) => ({
  common,
  loading: loading.models.common,
}))
class AttributeManagement extends React.Component {
  state = {
    condition: {},
    editorialPanelVisible: false,
    selectedItems: [],
    selectedRowKeys: [],
    managerType:PLATFORM.code
  };

  componentDidMount = () => this.request({ index: 1, size: 10 });

  request = (params, callback) => {
    const {condition,managerType:manager_type}=this.state;
    const payload = { netUrl: AttributeAPI.LIST.url, manager_type,condition, ...params };
    this.props.dispatch({ type: "common/handle", payload, callback });
    if(payload.netUrl!==AttributeAPI.LIST.url) this.cleanSelectedItem();
  }

  cleanSelectedItem = () => this.setState({ selectedRowKeys: [], selectedItems: [] });

  handleSetState = (obj,func) => func?this.setState(obj,()=>func()):this.setState(obj); // 改

  render() {
    const { common: { lang } } = this.props;
    const { managerType} = this.state;
    const tabList = [
      { key: PLATFORM.code, tab: PLATFORM[lang] },
      { key: SUPPLIER.code, tab: SUPPLIER[lang] },
    ];
    let params = {
      api: AttributeAPI,
      topProps:this.props,
      topState:this.state,
      baseTableProps:{},
      cleanSelectedItem:this.cleanSelectedItem,
      handleSetState:this.handleSetState,
      request: this.request,
      EditorialForm,
      tabList,
    };
    if ([SUPPLIER.code].includes(managerType)) {
      params = { ...params,hasInsertAction:false};
    }
    return getTableConfig(params);
  }
}

export default AttributeManagement;
