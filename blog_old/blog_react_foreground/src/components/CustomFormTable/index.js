import React, { Fragment } from 'react';
import { Modal, Button, Table } from 'antd';
import StandardTable from '@/components/StandardTable';
import ConditionQuery from '@/components/ConditionQuery';
import LangConfig from '@/assets/LangConfig';
import { CommonEnum } from '@/assets/Enum';

const { SortField } = CommonEnum;
const { CommonLang: { CLEAR, SINGLE_SELECTION, MULTIPLE_SELECTION, CLOSE,ACTION,DROP } } = LangConfig;

class CustomFormTable extends React.PureComponent {
  state = {
    index: 1,
    size: 6,
    condition: {},
    customFormTableVisible: false,
  };

  componentDidMount = () => {
    const {condition}=this.state;
    const { getList, netUrl, netValue={} } = this.props;
    const {size=6}=netValue;
    this.setState({ size });
    const customValue={...netValue};
    let conditionQuery={...condition};
    if(customValue.conditionQuery){
      conditionQuery={...condition,...customValue.conditionQuery};
      delete customValue.conditionQuery;
    }
    getList({ netUrl, index:1, size, conditionQuery, ...customValue  });
  }

  cleanSelectedItem = () => this.handleSelectRows([], []);

  onQuery = (condition) => {
    const { getList, netUrl, netValue={} } = this.props;
    const {size:pageSize}=this.state;
    const {size=pageSize}=netValue;
    this.setState({ condition,index:1, size });
    const customValue={...netValue};
    let conditionQuery={...condition};
    if(customValue.conditionQuery){
      conditionQuery={...condition,...customValue.conditionQuery};
      delete customValue.conditionQuery;
    }
    getList({ netUrl, index: 1, size,conditionQuery, ...customValue });
  }

  toggleCustomFormTable = () => this.setState((oldState) => ({ customFormTableVisible: !oldState.customFormTableVisible }));

  handleSelectRows = (keys, items) => {
    const {  onHandleCustomTableChange,formVerify} = this.props;
    onHandleCustomTableChange({keys, items,formVerify});
  }

  dataChange = ({ current: index, pageSize: size }, filters, sorter) => {
    const { getList, netUrl, netValue={}} = this.props;
    const { condition } = this.state;
    const { columnKey, order } = sorter;
    const sort = SortField[columnKey].code;
    const direction = order === "descend" ? 1 : 0;
    getList({ netUrl, direction, sort, index, size, ...condition, ...netValue });
    this.setState({ index, size });
  }

  dataChange = ({ current: index, pageSize: size }, filters, sorter) => {
    const { getList, netUrl, netValue={}} = this.props;
    const { condition } = this.state;
    const { columnKey, order } = sorter;
    const orderBy = columnKey ? { name: columnKey, by: order === 'descend' ? 'desc' : 'asc' } : {};
    const customValue={...netValue};
    let conditionQuery={...condition,orderBy};
    if(customValue.conditionQuery){
      conditionQuery={...condition,...customValue.conditionQuery};
      delete customValue.conditionQuery;
    }
    getList({ netUrl, index, size, conditionQuery, ...customValue });
    this.setState({ index, size });
  };

  getTableScroll=(columns)=>({ x: !columns[0].width.toString().endsWith("%") ? columns.reduce((col_width, column) => col_width + column.width, 0) : undefined });

  render() {
    const { 
      list = [], 
      total = 6, 
      selectedItems = [], 
      hasConditionQuery = true, 
      hasBaseTableRowSelection = true,
      hasBaseTableAction=true,
      hasShowTableAction=true, 
      extraTip, 
      selectBtnName, 
      type = "checkbox", 
      tableWidth, 
      lang="zh_CN", 
      actionColumnConfig,
      onHandleCustomTableChange,
      actionColumn,
      netUrl,
      itemTable:{COLUMNS,CONDITION},
      formVerify,
      notAllowChange,
      showTableConfig={},
      ...restProps 
    } = this.props;
    const { condition, customFormTableVisible, index, size } = this.state;
    const selectedRowKeys = selectedItems.map(i => i.id);
    console.log(selectedRowKeys)
    const customActionColumn =actionColumn || {
      title: ACTION[lang], 
      dataIndex: 'x', 
      align: 'center', 
      render: (_, item) => selectedItems.some(i => i.id === item.id) &&
        <Button size="small" style={{ color: "white", background: "red" }} onClick={() => onHandleCustomTableChange({keys:selectedItems.filter(i => i.id !== item.id).map(i => i.id), items:[], formVerify,notAllowChange})}>{DROP[lang]}</Button>,
      ...actionColumnConfig
    };
    const baseTableColumns=hasBaseTableAction?[...COLUMNS,customActionColumn]:COLUMNS;
    const showTableColumns=hasShowTableAction?[...COLUMNS,customActionColumn]:COLUMNS;
    return (
      <Fragment>
        <Button type="primary" icon="folder-open" onClick={this.toggleCustomFormTable}>{selectBtnName}</Button>&nbsp;&nbsp;
        {selectedItems.length > 0 && <Button type="danger" icon="delete" onClick={this.cleanSelectedItem}>{CLEAR[lang]}</Button>}
        <span style={{ color: "#1890FF", marginLeft: "10px" }}>{type === "checkbox" ? MULTIPLE_SELECTION[lang] : SINGLE_SELECTION[lang]}</span>
        <span style={{ color: "red", marginLeft: "10px" }}>{extraTip}</span>
        {selectedItems.length > 0 &&
          <Table
            dataSource={selectedItems}
            columns={showTableColumns}
            rowKey={record => record.id}
            pagination={false}
            size="small"
            scroll={this.getTableScroll(showTableColumns)}
            style={{ ...tableWidth, marginTop: "10px" }}
            {...showTableConfig}
          />
        }
        <Modal
          title={selectBtnName}
          destroyOnClose
          visible={customFormTableVisible}
          onCancel={this.toggleCustomFormTable}
          footer={<Button type="primary" onClick={this.toggleCustomFormTable}>{CLOSE[lang]}</Button>}
          maskClosable={false}
          width={1200}
        >
          {hasConditionQuery && <ConditionQuery modalFormConfig={CONDITION} condition={condition} onQuery={this.onQuery} lang={lang} />}
          <StandardTable
            number={selectedItems.length}
            cleanSelectedItem={this.cleanSelectedItem}
            rowSelection={hasBaseTableRowSelection ? { selectedRowKeys, type, onChange: this.handleSelectRows } : undefined}
            dataSource={list}
            columns={baseTableColumns}
            rowKey={record => record.id}
            pagination={{ showQuickJumper: true, showSizeChanger: true, total, current: index, pageSize: size, defaultPageSize: size===100?100:6, pageSizeOptions: ["6", "12", "24", "36","100"] }}
            onChange={this.dataChange}
            scroll={this.getTableScroll(baseTableColumns)}
            lang={lang}
            {...restProps}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default CustomFormTable;
