import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import EditorialForm from './EditorialForm';
import { UrlEnum, SystemEnum, CommonEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';
import TableConfig from '@/pages/TableConfig';

const { ValueAPI, ValueAPI: { BASE_URL, LIST, FORM, LOCK, UNLOCK, REMOVE } } = UrlEnum;
const { PlatType_POS: { PLATFORM, SUPPLIER } } = SystemEnum;
const { Bool } = CommonEnum;
const { getTableConfig, ValueTable: { COLUMNS_REST }, handleItems, handleSelectRows, commontoggleEditorialPanel } = TableConfig;
const { CommonLang: { ACTION } } = LangConfig;
const btnConfig = { type: "primary", size: "small", style: { margin: "0px 4px" } };

@connect(({ loading, common }) => ({
  common,
  loading: loading.models.common,
}))
class AttributeValueManagement extends React.Component {
  state = {
    condition: {},
    editorialPanelVisible: false,
    selectedItems: [],
    selectedRowKeys: [],
    managerType: PLATFORM.code
  };

  componentDidMount = () => this.request({ index: 1, size: 10 });

  request = (params, callback) => {
    const { condition, managerType: manager_type } = this.state;
    const payload = { netUrl: LIST.url, manager_type, condition, ...params };
    this.props.dispatch({ type: "common/handle", payload, callback });
    if (payload.netUrl !== LIST.url) this.cleanSelectedItem();
  }

  cleanSelectedItem = () => this.setState({ selectedRowKeys: [], selectedItems: [] });

  handleSetState = (obj, func) => func ? this.setState(obj, () => func()) : this.setState(obj);

  render() {
    const { common: { lang } } = this.props;
    const { selectedItems, selectedRowKeys, managerType } = this.state;
    const expandedRowRender = (record) => {
      const columns = [...COLUMNS_REST.filter(i => !["owner_name", "owner_id", "owner_type"].includes(i.dataIndex)), {
        title: ACTION[lang], dataIndex: 'x', render: (_, item) =>
          <Fragment>
            {!Bool[item.s_is_lock].flag &&
              <Fragment>
                {Bool[item.is_lock].flag &&
                  <Fragment>
                    <Button {...btnConfig} onClick={() => handleItems({ action: UNLOCK, item, selectedItems, request: this.request, commontoggleEditorialPanel, topState: this.state, handleSetState: this.handleSetState })}>{UNLOCK.desc[lang]}</Button>
                    <Button {...btnConfig} onClick={() => handleItems({ action: REMOVE, item, selectedItems, request: this.request, commontoggleEditorialPanel, topState: this.state, handleSetState: this.handleSetState })}>{REMOVE.desc[lang]}</Button>
                  </Fragment>
                }
                {!Bool[item.is_lock].flag &&
                  <Fragment>
                    <Button {...btnConfig} onClick={() => handleItems({ action: LOCK, item, selectedItems, request: this.request, commontoggleEditorialPanel, topState: this.state, handleSetState: this.handleSetState })}>{LOCK.desc[lang]}</Button>
                    <Button {...btnConfig} onClick={() => handleItems({ action: FORM, item, selectedItems, request: this.request, commontoggleEditorialPanel, topState: this.state, handleSetState: this.handleSetState })}>{FORM.desc[lang]}</Button>
                  </Fragment>
                }
              </Fragment>
            }
          </Fragment>
      }];
      return (
        <Table
          dataSource={record.values}
          columns={columns}
          rowKey={row => row.id}
          pagination={!!(record.values.length > 10)}
          rowSelection={{ selectedRowKeys, onChange: (keys, items) => handleSelectRows(keys, items, selectedItems, this.handleSetState) }}
        />
      )
    }
    const tabList = [
      { key: PLATFORM.code, tab: PLATFORM[lang] },
      { key: SUPPLIER.code, tab: SUPPLIER[lang] },
    ];
    let params = {
      api: ValueAPI,
      topProps: this.props,
      topState: this.state,
      baseTableProps: { expandedRowRender },
      cleanSelectedItem: this.cleanSelectedItem,
      handleSetState: this.handleSetState,
      request: this.request,
      EditorialForm,
      tabList,
      hasBaseTableAction: false
    };
    if ([SUPPLIER.code].includes(managerType)) {
      params = { ...params,hasInsertAction:false,baseTableProps:{expandedRowRender:(record)=>{
        const columns = [...COLUMNS_REST, {
          title: ACTION[lang], dataIndex: 'action', render: (_, item) =>
            <Fragment>
              {Bool[item.is_lock].flag && <Button {...btnConfig} onClick={() => handleItems({action:UNLOCK, item, selectedItems, request:this.request, commontoggleEditorialPanel,topState:this.state,handleSetState:this.handleSetState})}>{UNLOCK.desc[lang]}</Button>}
              {!Bool[item.is_lock].flag && <Button {...btnConfig} onClick={() => handleItems({action:LOCK, item, selectedItems, request:this.request, commontoggleEditorialPanel,topState:this.state,handleSetState:this.handleSetState})}>{LOCK.desc[lang]}</Button>}
            </Fragment>
        }];
        return (
          <Table
            dataSource={record.values}
            columns={columns}
            rowKey={row => row.id}
            pagination={!!(record.values.length > 10)}
            rowSelection={{ selectedRowKeys, onChange: (keys,items)=>handleSelectRows(keys,items,selectedItems,this.handleSetState) }}
          />
        );
      }}};
    }
    return getTableConfig(params);
  }
}

export default AttributeValueManagement;
